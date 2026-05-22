"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  Heart, 
  Bookmark, 
  Share2, 
  ArrowLeft, 
  Calendar, 
  BookOpen, 
  Sparkles, 
  Check,
  Home
} from "lucide-react";
import api from "@/lib/api";
import Link from "next/link";
import "@/components/editor/editor.css";
import hljs from "highlight.js";

export default function PostPublicPage() {
  const params = useParams();
  const router = useRouter();
  const username = params?.username;
  const postId = params?.postSlug;

  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Interactive mock states
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!postId) return;

    const fetchArticle = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/editor/public/${postId}`);
        if (res.data.success) {
          setArticle(res.data.article);
          // Set document title dynamically
          if (res.data.article?.title) {
            document.title = `${res.data.article.title} - WriteNova`;
          }
        }
      } catch (err) {
        console.error("Failed to load public article:", err);
        setError("Article not found or could not be loaded.");
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [postId]);
  
  // Trigger syntax highlighting on code blocks
  useEffect(() => {
    if (article?.content) {
      const timer = setTimeout(() => {
        const blocks = document.querySelectorAll("article.tiptap pre code");
        blocks.forEach((block) => {
          try {
            hljs.highlightElement(block);
          } catch (e) {
            console.error("Syntax highlighting error:", e);
          }
        });
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [article]);

  const handleShare = () => {
    if (typeof window === "undefined") return;
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getAuthorBg = (authorId) => {
    const gradients = [
      "from-emerald-400 to-teal-600 text-white",
      "from-indigo-500 to-purple-600 text-white",
      "from-pink-400 to-rose-500 text-white",
      "from-blue-400 to-indigo-600 text-white",
      "from-amber-400 to-orange-500 text-white",
    ];
    if (!authorId) return gradients[0];
    const code = authorId.toString().split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return `bg-gradient-to-br ${gradients[code % gradients.length]}`;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const getReadTime = (html) => {
    if (!html) return "1 min read";
    const text = html.replace(/<[^>]+>/g, "");
    const words = text.split(/\s+/).filter(Boolean).length;
    const minutes = Math.max(1, Math.ceil(words / 200));
    return `${minutes} min read`;
  };

  const getLikesCount = (id) => {
    if (!id) return 0;
    const code = id.toString().split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return (code % 150) + 12;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        {/* Placeholder Top Nav */}
        <div className="h-16 border-b border-gray-100 flex items-center justify-between px-6 bg-white/80 backdrop-blur-md">
          <div className="h-5 w-24 bg-gray-200 rounded-md animate-pulse" />
          <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse" />
        </div>

        {/* Loading Content */}
        <div className="mx-auto max-w-3xl py-16 px-4 sm:px-6">
          <div className="h-4 w-20 bg-gray-200 rounded-full animate-pulse mb-6" />
          <div className="h-12 w-3/4 bg-gray-200 rounded-lg animate-pulse mb-8" />
          
          <div className="flex items-center gap-4 mb-10">
            <div className="h-10 w-10 bg-gray-200 rounded-full animate-pulse" />
            <div className="space-y-2">
              <div className="h-4 w-32 bg-gray-200 rounded-md animate-pulse" />
              <div className="h-3 w-24 bg-gray-200 rounded-md animate-pulse" />
            </div>
          </div>

          <div className="h-64 sm:h-80 w-full bg-gray-200 rounded-2xl animate-pulse mb-10" />
          
          <div className="space-y-4">
            <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-[90%] bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-[80%] bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-gray-50/50 flex flex-col justify-center items-center p-6 text-center animate-in fade-in duration-300">
        <div className="bg-white border border-gray-100 rounded-3xl p-8 max-w-md shadow-sm">
          <h2 className="text-2xl font-serif font-bold text-gray-900 mb-2">Article Not Found</h2>
          <p className="text-gray-500 mb-6">{error || "The article you are trying to view does not exist or has not been published yet."}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => router.back()}
              className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full text-sm font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" /> Go Back
            </button>
            <Link 
              href="/dashboard" 
              className="px-5 py-2.5 bg-black hover:bg-neutral-800 text-white rounded-full text-sm font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Home className="h-4 w-4" /> Home Feed
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const authorVal = article.author?.username || article.author?.email?.split("@")[0] || "Anonymous";
  const initialsVal = authorVal.substring(0, 2).toUpperCase();
  const authorBgVal = getAuthorBg(article.author?._id);
  const formattedDate = formatDate(article.createdAt);
  const readTimeVal = getReadTime(article.content);
  const baseLikes = getLikesCount(article._id);
  const likesCountVal = baseLikes + (liked ? 1 : 0);

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Dynamic Header / Navbar */}
      <header className="sticky top-0 z-30 w-full border-b border-gray-100/80 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="group flex h-8 w-8 items-center justify-center rounded-full border border-gray-100 bg-white text-gray-600 hover:bg-gray-50 active:scale-95 transition-all cursor-pointer"
              title="Go back"
            >
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
            </button>
            <Link href="/" className="font-serif text-lg font-bold tracking-tight text-black hover:opacity-80 transition-opacity">
              WriteNova
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="rounded-full border border-gray-200 px-4 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Dashboard
            </Link>
            <Link
              href="/editor/new"
              className="rounded-full bg-black px-4 py-1.5 text-xs font-semibold text-white hover:bg-neutral-800 transition-colors"
            >
              Write a story
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Layout */}
      <main className="mx-auto max-w-5xl py-12 px-4 sm:px-6 animate-in fade-in slide-in-from-bottom-3 duration-500">
        
        {/* Topics strip */}
        <div className="flex flex-wrap gap-2 mb-6">
          {article.topics && article.topics.length > 0 ? (
            article.topics.map((topic) => (
              <span 
                key={topic} 
                className="text-xs font-semibold bg-neutral-100 text-neutral-600 px-3 py-1 rounded-full capitalize select-none"
              >
                {topic}
              </span>
            ))
          ) : (
            <span className="text-xs font-semibold bg-neutral-100 text-neutral-600 px-3 py-1 rounded-full select-none">
              {article.generationMeta?.category || "General"}
            </span>
          )}
        </div>

        {/* Title */}
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight mb-6">
          {article.title || "Untitled"}
        </h1>

        {/* Author & Meta Line */}
        <div className="flex items-center justify-between border-y border-gray-100 py-4 mb-8">
          <div className="flex items-center gap-3">
            <Link 
              href={`/${username}`}
              className={`h-10 w-10 rounded-full flex items-center justify-center font-bold text-xs shadow-sm hover:opacity-90 active:scale-95 transition-all select-none ${authorBgVal}`}
            >
              {initialsVal}
            </Link>
            <div>
              <Link 
                href={`/${username}`} 
                className="text-sm font-semibold text-gray-900 hover:underline hover:text-black block"
              >
                {authorVal}
              </Link>
              <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-0.5">
                <Calendar className="h-3 w-3" />
                <span>{formattedDate}</span>
                <span>•</span>
                <BookOpen className="h-3 w-3" />
                <span>{readTimeVal}</span>
                {article.aiGenerated && (
                  <>
                    <span>•</span>
                    <span className="flex items-center gap-0.5 text-indigo-500 font-semibold font-sans">
                      <Sparkles className="h-3 w-3" /> AI
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Social / Quick Action Strip */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setLiked(!liked)}
              className={`p-2 rounded-full hover:bg-gray-50 active:scale-90 transition-all cursor-pointer ${
                liked ? "text-rose-600" : "text-gray-400 hover:text-gray-600"
              }`}
              title={liked ? "Unlike article" : "Like article"}
            >
              <Heart className={`h-5 w-5 ${liked ? "fill-rose-600 text-rose-600 scale-110" : ""}`} />
            </button>
            
            <button
              onClick={() => setBookmarked(!bookmarked)}
              className={`p-2 rounded-full hover:bg-gray-50 active:scale-90 transition-all cursor-pointer ${
                bookmarked ? "text-amber-500" : "text-gray-400 hover:text-gray-600"
              }`}
              title={bookmarked ? "Saved" : "Save article"}
            >
              <Bookmark className="h-5 w-5" fill={bookmarked ? "currentColor" : "none"} />
            </button>
            
            <button
              onClick={handleShare}
              className={`p-2 rounded-full hover:bg-gray-50 active:scale-90 transition-all text-gray-400 hover:text-gray-600 relative cursor-pointer`}
              title="Copy share link"
            >
              {copied ? (
                <Check className="h-5 w-5 text-emerald-600 animate-in zoom-in duration-200" />
              ) : (
                <Share2 className="h-5 w-5" />
              )}
              {copied && (
                <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-[10px] rounded font-semibold whitespace-nowrap shadow-md">
                  Copied!
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Cover Image */}
        {article.coverImage && (
          <div className="w-full overflow-hidden rounded-2xl border border-gray-100 bg-gray-50 shadow-sm mb-10">
            <img
              src={article.coverImage}
              alt={article.title}
              className="w-full object-cover aspect-[21/9] sm:aspect-[16/9] hover:scale-[1.01] transition-transform duration-500"
            />
          </div>
        )}

        {/* Excerpt (Intro paragraph style) */}
        {article.excerpt && (
          <div className="border-l-4 border-black pl-5 italic text-gray-600 text-lg leading-relaxed font-sans mb-10 py-1">
            {article.excerpt}
          </div>
        )}

        {/* HTML Article Content */}
        <article className="tiptap prose prose-neutral max-w-none">
          <div dangerouslySetInnerHTML={{ __html: article.content }} />
        </article>

        {/* Bottom Metadata & Footer Action Box */}
        <div className="border-t border-gray-100 mt-16 pt-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 bg-gray-50/50 border border-gray-100 rounded-3xl p-6">
            <div className="flex items-center gap-4">
              <Link 
                href={`/${username}`}
                className={`h-12 w-12 rounded-full flex items-center justify-center font-bold text-sm shadow-md hover:opacity-90 transition-all select-none ${authorBgVal}`}
              >
                {initialsVal}
              </Link>
              <div>
                <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Written by</p>
                <Link href={`/${username}`} className="text-base font-bold text-gray-900 hover:underline mt-0.5 block">
                  {authorVal}
                </Link>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setLiked(!liked)}
                className={`flex items-center gap-2 px-4 py-2 border rounded-full text-xs font-bold transition-all cursor-pointer ${
                  liked 
                    ? "bg-rose-50 border-rose-100 text-rose-600" 
                    : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-black"
                }`}
              >
                <Heart className={`h-4 w-4 ${liked ? "fill-rose-600" : ""}`} />
                <span>{likesCountVal} Likes</span>
              </button>

              <Link
                href={`/${username}`}
                className="px-4 py-2 bg-black hover:bg-neutral-800 text-white rounded-full text-xs font-bold transition-colors text-center cursor-pointer"
              >
                More from {authorVal}
              </Link>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
