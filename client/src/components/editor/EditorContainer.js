"use client";

import { useAuthStore } from "@/features/auth/store";
import { useArticleStore } from "@/store/articleStore";
import { debounce } from "@/features/editor/autosave";
import api from "@/lib/api";
import { marked } from "marked";
import { useRouter } from "next/navigation";
import { useState, useEffect, useCallback, useRef } from "react";
import SimpleEditor from "./SimpleEditor";
import EditorHeader from "./EditorHeader";
import AiAssistant from "./AiAssistant";
import PublishModal from "./PublishModal";
import {
  FileText,
  AlertCircle,
  Loader2,
} from "lucide-react";

export default function EditorContainer({ postId }) {
  const router = useRouter();
  const accessToken = useAuthStore((state) => state.accessToken);
  const publishArticleStatus = useArticleStore((state) => state.publishArticleStatus);

  // Editor states
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // AI Generation states
  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState("Informative and engaging");
  const [length, setLength] = useState("500-700 words");
  const [category, setCategory] = useState("Technology");
  const [generating, setGenerating] = useState(false);
  // Save states
  const [saveStatus, setSaveStatus] = useState("idle"); // idle, saving, saved, error
  const [status, setStatus] = useState("draft");
  const [publishing, setPublishing] = useState(false);

  // Publish Modal settings
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalDescription, setModalDescription] = useState("");
  const [modalImage, setModalImage] = useState("https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=60");
  const [modalTopics, setModalTopics] = useState("");

  // Ref to skip re-fetching after generation completes (URL changes but content is already in state)
  const justGeneratedRef = useRef(false);
  // Ref to suppress onUpdate feedback loop during streaming
  const isStreamingRef = useRef(false);
  const isCreatingRef = useRef(false);

  const createDraftIfNeeded = async (currentTitle, currentContent) => {
    if (isCreatingRef.current || postId !== "new") return;
    isCreatingRef.current = true;
    setSaveStatus("saving");
    try {
      const res = await api.post("/editor", {
        title: currentTitle || "Untitled Article",
        content: currentContent || "",
        status: "draft",
      });
      if (res.data.success) {
        const newId = res.data.article._id;
        justGeneratedRef.current = true;
        setSaveStatus("saved");
        router.replace(`/editor/${newId}`);
      } else {
        setSaveStatus("error");
        isCreatingRef.current = false;
      }
    } catch (err) {
      console.error("Failed to create draft:", err);
      setSaveStatus("error");
      isCreatingRef.current = false;
    }
  };

  // Fetch article if editing existing one
  useEffect(() => {
    if (postId && postId !== "new") {
      // Skip fetch if we just finished generating — content is already in state as HTML
      if (justGeneratedRef.current) {
        justGeneratedRef.current = false;
        return;
      }

      const fetchArticle = async () => {
        setLoading(true);
        try {
          const res = await api.get(`/editor/${postId}`);
          if (res.data.success) {
            setTitle(res.data.article.title || "");
            const raw = res.data.article.content || "";
            // If content looks like raw markdown (not HTML), parse it
            const isHtml = raw.trimStart().startsWith("<");
            const htmlContent = isHtml ? raw : await marked.parse(raw);
            setContent(htmlContent);
            setStatus(res.data.article.status || "draft");
            setSaveStatus("saved");
            
            // Prefill publish preview fields from database
            if (res.data.article.coverImage) {
              setModalImage(res.data.article.coverImage);
            }
            if (res.data.article.excerpt) {
              setModalDescription(res.data.article.excerpt);
            }
            if (res.data.article.topics && res.data.article.topics.length > 0) {
              setModalTopics(res.data.article.topics.join(", "));
            }
          }
        } catch (err) {
          console.error("Failed to load article:", err);
          setError("Failed to load this article. It may have been deleted.");
        } finally {
          setLoading(false);
        }
      };
      fetchArticle();
    } else {
      // Clear for new article
      setTitle("Untitled Article");
      setContent("");
      setStatus("draft");
      setSaveStatus("idle");
      isCreatingRef.current = false;
    }
  }, [postId]);

  // Debounced save content
  const debouncedSaveContent = useCallback(
    debounce(async (id, currentTitle, htmlContent) => {
      if (!id || id === "new") return;
      setSaveStatus("saving");
      try {
        await api.put(`/editor/${id}`, { title: currentTitle, content: htmlContent });
        setSaveStatus("saved");
      } catch (err) {
        console.error("Autosave failed:", err);
        setSaveStatus("error");
      }
    }, 1500),
    []
  );

  const handleContentChange = (newHtml) => {
    // Ignore onUpdate events fired while we are streaming content into the editor
    if (isStreamingRef.current) return;
    setContent(newHtml);
    if (postId !== "new") {
      debouncedSaveContent(postId, title, newHtml);
    } else {
      createDraftIfNeeded(title, newHtml);
    }
  };

  const handleTitleChange = (newTitle) => {
    setTitle(newTitle);
    if (postId !== "new") {
      debouncedSaveContent(postId, newTitle, content);
    } else {
      createDraftIfNeeded(newTitle, content);
    }
  };

  const handlePublishToggle = async () => {
    if (status === "published") {
      setPublishing(true);
      setError("");
      try {
        const res = await api.put(`/editor/${postId}`, { status: "draft" });
        if (res.data.success) {
          setStatus("draft");
          publishArticleStatus(postId, "draft");
        }
      } catch (err) {
        console.error("Failed to update status:", err);
        setError("Failed to update publication status.");
      } finally {
        setPublishing(false);
      }
    } else {
      openPublishModal();
    }
  };

  // Extract images from editor HTML content
  const getEditorImages = () => {
    if (!content) return [];
    const regex = /<img[^>]+src="([^">]+)"/g;
    const urls = [];
    let match;
    while ((match = regex.exec(content)) !== null) {
      if (match[1]) {
        urls.push(match[1]);
      }
    }
    return [...new Set(urls)];
  };

  const openPublishModal = () => {
    // Strip HTML to get plain text excerpt
    const plainText = content ? content.replace(/<[^>]+>/g, "").trim() : "";
    const initialExcerpt = plainText.substring(0, 140);
    setModalTitle(title.substring(0, 100));
    
    if (!modalDescription) {
      setModalDescription(initialExcerpt);
    }
    if (!modalTopics) {
      setModalTopics(category || "General");
    }

    // Default to the first editor image if currently using default Unsplash image
    const defaultUnsplashImage = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=60";
    const editorImages = getEditorImages();
    if (modalImage === defaultUnsplashImage && editorImages.length > 0) {
      setModalImage(editorImages[0]);
    }

    setShowPublishModal(true);
  };

  const handlePublishSubmit = async (e) => {
    e.preventDefault();
    if (!postId) return;
    
    // Parse topics (max 5)
    const parsedTopics = modalTopics
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0)
      .slice(0, 5);

    if (!modalTitle.trim()) {
      setError("Title is required");
      return;
    }
    if (!modalDescription.trim()) {
      setError("Description is required");
      return;
    }
    if (parsedTopics.length === 0) {
      setError("At least one topic is required");
      return;
    }

    setPublishing(true);
    setError("");

    try {
      let res;
      if (postId === "new") {
        res = await api.post("/editor", {
          title: modalTitle,
          content: content,
          excerpt: modalDescription,
          coverImage: modalImage,
          topics: parsedTopics,
          status: "published",
        });
      } else {
        res = await api.put(`/editor/${postId}`, {
          title: modalTitle,
          excerpt: modalDescription,
          coverImage: modalImage,
          topics: parsedTopics,
          status: "published",
        });
      }

      if (res.data.success) {
        setStatus("published");
        setTitle(modalTitle);
        setShowPublishModal(false);
        const finalId = postId === "new" ? res.data.article._id : postId;
        publishArticleStatus(finalId, "published", {
          title: modalTitle,
          excerpt: modalDescription,
          coverImage: modalImage,
          topics: parsedTopics,
        });
        router.push("/posts");
      }
    } catch (err) {
      console.error("Failed to publish:", err);
      setError("Failed to publish the article.");
    } finally {
      setPublishing(false);
    }
  };

  // Generate article using streaming connection
  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setGenerating(true);
    isStreamingRef.current = true;
    setError("");
    setContent("");
    setTitle(topic);
    setSaveStatus("idle");

    try {
      const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000/api";
      const response = await fetch(`${serverUrl}/ai/generate-article`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ topic, tone, length, category }),
      });

      if (!response.ok) {
        throw new Error(`Failed to generate article: ${response.statusText}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let streamedText = "";
      let finalParsedHtml = "";

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        const chunk = decoder.decode(value, { stream: !done });
        streamedText += chunk;

        let contentToRender = streamedText;
        let finalId = null;

        // Extract metadata ID from the end of the stream
        if (streamedText.includes("__METADATA__:")) {
          const parts = streamedText.split("__METADATA__:");
          contentToRender = parts[0];
          finalId = parts[1].trim();
        }

        // Convert the Markdown to HTML on the fly
        const parsedHtml = await marked.parse(contentToRender);
        finalParsedHtml = parsedHtml;
        setContent(parsedHtml);

        // Once we get the DB ID, save the HTML to the DB and update the URL
        if (finalId) {
          // Mark that generation just finished so the useEffect skips the fetch
          justGeneratedRef.current = true;

          // Save the HTML version to the database (overwrite the raw markdown)
          try {
            await api.put(`/editor/${finalId}`, { title: topic, content: finalParsedHtml });
          } catch (saveErr) {
            console.error("Failed to save HTML to DB after generation:", saveErr);
          }

          router.replace(`/editor/${finalId}`);
          setSaveStatus("saved");
        }
      }
    } catch (err) {
      console.error(err);
      setError("AI generation failed. Please try again.");
      setSaveStatus("error");
    } finally {
      setGenerating(false);
      isStreamingRef.current = false;
    }
  };



  if (loading) {
    return (
      <div className="flex h-[calc(100vh-65px)] items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 text-black animate-spin stroke-[1.5]" />
          <span className="text-sm text-gray-500 font-medium">Loading your draft...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50/30">
      {/* ── SUB-HEADER BAR ── */}
      <EditorHeader
        postId={postId}
        status={status}
        saveStatus={saveStatus}
        publishing={publishing}
        onPublishToggle={handlePublishToggle}
      />

      {/* -- EDITOR MAIN LAYOUT -- */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Hand: AI Generation Control Panel (Collapsible or 4 columns) */}
        {postId === "new" && (
          <AiAssistant
            topic={topic}
            setTopic={setTopic}
            tone={tone}
            setTone={setTone}
            length={length}
            setLength={setLength}
            category={category}
            setCategory={setCategory}
            generating={generating}
            onGenerate={handleGenerate}
          />
        )}

        {/* Right Hand / Full Width: Tiptap Dev Simple Editor */}
        <div className={postId === "new" ? "lg:col-span-8 flex flex-col gap-4" : "lg:col-span-12 flex flex-col gap-4"}>
          {error && (
            <div className="bg-red-50 text-red-700 border border-red-100 rounded-2xl p-4 text-sm flex items-center gap-2">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Title Editor */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col gap-1.5">
            <input
              type="text"
              className="w-full text-2xl sm:text-3.5xl font-serif font-bold text-gray-900 border-none outline-none focus:ring-0 bg-transparent placeholder-gray-300"
              placeholder="Article Title..."
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              disabled={generating}
            />
            <div className="flex items-center gap-2 text-xs text-gray-400 font-medium">
              <FileText className="h-3.5 w-3.5" />
              <span>{status === "published" ? "Published Document" : "Draft Document"}</span>
              {postId !== "new" && (
                <>
                  <span>•</span>
                  <span>ID: {postId}</span>
                </>
              )}
            </div>
          </div>

          {/* Tiptap Editor */}
          <SimpleEditor
            content={content}
            onChange={handleContentChange}
            placeholder={generating ? "AI is typing your masterpiece..." : "Write your masterpiece..."}
          />
        </div>
      </div>

      {/* ── PUBLISH MODAL ── */}
      <PublishModal
        isOpen={showPublishModal}
        onClose={() => setShowPublishModal(false)}
        onSubmit={handlePublishSubmit}
        title={modalTitle}
        setTitle={setModalTitle}
        description={modalDescription}
        setDescription={setModalDescription}
        coverImage={modalImage}
        setCoverImage={setModalImage}
        topics={modalTopics}
        setTopics={setModalTopics}
        editorImages={getEditorImages()}
        publishing={publishing}
      />
    </div>
  );
}
