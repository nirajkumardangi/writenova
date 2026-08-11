"use client";

import { useState, useEffect } from "react";
import { Bookmark, Heart, MessageCircle, MoreHorizontal, Loader2, Sparkles, Filter, X } from "lucide-react";
import api from "@/lib/api";
import Link from "next/link";
import { getStorySlug } from "@/lib/slugify";
import CommentsDrawer from "./CommentsDrawer";

export default function Feed({ selectedTopic, onClearTopic }) {
  const [activeTab, setActiveTab] = useState("for-you");
  const [bookmarks, setBookmarks] = useState({});
  const [likes, setLikes] = useState({});
  const [likeCounts, setLikeCounts] = useState({});
  const [commentCounts, setCommentCounts] = useState({});
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeArticleForComments, setActiveArticleForComments] = useState(null);

  // Load persistent likes and bookmarks from localStorage
  useEffect(() => {
    try {
      const savedLikes = JSON.parse(localStorage.getItem("writenova_likes") || "{}");
      const savedBookmarks = JSON.parse(localStorage.getItem("writenova_bookmarks") || "{}");
      setLikes(savedLikes);
      setBookmarks(savedBookmarks);
    } catch (e) {
      console.error("Failed to load likes/bookmarks from storage:", e);
    }
  }, []);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await api.get("/editor/feed");
        if (res.data.success) {
          setArticles(res.data.articles || []);
        }
      } catch (err) {
        console.error("Failed to fetch feed articles:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  const toggleBookmark = (id) => {
    setBookmarks((prev) => {
      const updated = { ...prev, [id]: !prev[id] };
      localStorage.setItem("writenova_bookmarks", JSON.stringify(updated));
      return updated;
    });
  };

  const toggleLike = (id) => {
    setLikes((prev) => {
      const isCurrentlyLiked = !!prev[id];
      const updatedLikes = { ...prev, [id]: !isCurrentlyLiked };
      localStorage.setItem("writenova_likes", JSON.stringify(updatedLikes));

      // Update count
      const base = getLikesCount(id);
      setLikeCounts((cPrev) => ({
        ...cPrev,
        [id]: isCurrentlyLiked ? Math.max(0, (cPrev[id] ?? base) - 1) : (cPrev[id] ?? base) + 1,
      }));

      return updatedLikes;
    });
  };

  const handleCommentAdded = (articleId, newCount) => {
    setCommentCounts((prev) => ({
      ...prev,
      [articleId]: newCount,
    }));
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
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const truncateContent = (html) => {
    if (!html) return "";
    const text = html.replace(/<[^>]+>/g, "");
    return text.length > 180 ? text.substring(0, 180) + "..." : text;
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
    if (likeCounts[id] !== undefined) return likeCounts[id];
    const code = id.toString().split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const base = (code % 150) + 12;
    return likes[id] ? base + 1 : base;
  };

  const getCommentsCount = (id) => {
    if (!id) return 0;
    if (commentCounts[id] !== undefined) return commentCounts[id];
    const code = id.toString().split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return (code % 25) + 2;
  };

  // Filter articles by tab and topic selection
  let filteredStories = articles;

  if (selectedTopic) {
    filteredStories = filteredStories.filter((a) => {
      const cat = (a.generationMeta?.category || "").toLowerCase();
      const topicLower = selectedTopic.toLowerCase();
      return cat.includes(topicLower) || (a.title || "").toLowerCase().includes(topicLower);
    });
  }

  if (activeTab === "featured") {
    filteredStories = filteredStories.filter((a) => a.aiGenerated);
  } else if (activeTab === "following") {
    // Show followed articles or half of articles for demonstration
    filteredStories = filteredStories.slice(0, Math.max(1, Math.floor(filteredStories.length / 2)));
  }

  return (
    <div className="mx-auto max-w-3xl py-8 px-4 sm:px-6">
      {/* Navigation Tabs */}
      <div className="border-b border-gray-100 mb-8 sticky top-0 bg-white z-10 select-none">
        <nav className="-mb-px flex gap-8 items-center justify-between">
          <div className="flex gap-8">
            {["for-you", "following", "featured"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`whitespace-nowrap border-b-2 py-4 px-1 text-[14px] sm:text-[15px] font-semibold transition-colors cursor-pointer capitalize ${
                  activeTab === tab
                    ? "border-black text-black"
                    : "border-transparent text-gray-400 hover:border-gray-300 hover:text-gray-700"
                }`}
              >
                {tab.replace("-", " ")}
              </button>
            ))}
          </div>

          {selectedTopic && (
            <div className="flex items-center gap-2 bg-black text-white text-xs px-3 py-1 rounded-full font-medium">
              <Filter className="h-3 w-3" />
              <span>{selectedTopic}</span>
              <button onClick={onClearTopic} className="hover:text-gray-300 ml-1 cursor-pointer">
                <X className="h-3 w-3" />
              </button>
            </div>
          )}
        </nav>
      </div>

      {/* Stories list */}
      <div className="flex flex-col gap-10">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-8 w-8 text-black animate-spin stroke-[1.5]" />
            <span className="mt-3 text-sm text-gray-500 font-medium">Loading stories...</span>
          </div>
        ) : filteredStories.length > 0 ? (
          filteredStories.map((article) => {
            const authorName = article.author?.username || article.author?.email?.split("@")[0] || "Anonymous";
            const authorUsername = article.author?.username || "author";
            const initials = authorName.substring(0, 2).toUpperCase();
            const authorBg = getAuthorBg(article.author?._id);
            const isLiked = !!likes[article._id];
            const isBookmarked = !!bookmarks[article._id];
            const publicUrl = `/${authorUsername}/${getStorySlug(article)}`;

            return (
              <article key={article._id} className="flex flex-col gap-3 pb-10 border-b border-gray-100/80 last:border-b-0 group">
                {/* Author row */}
                <div className="flex items-center gap-2.5">
                  <Link href={`/${authorUsername}`}>
                    <div
                      className={`h-7 w-7 rounded-full flex items-center justify-center font-bold text-[11px] shadow-xs select-none ${authorBg}`}
                    >
                      {initials}
                    </div>
                  </Link>
                  <Link href={`/${authorUsername}`} className="text-xs font-semibold text-gray-900 hover:underline">
                    {authorName}
                  </Link>
                  <span className="text-xs text-gray-400 font-medium">•</span>
                  <span className="text-xs text-gray-400 font-medium">{formatDate(article.createdAt)}</span>
                  {article.aiGenerated && (
                    <span className="ml-auto flex items-center gap-1 text-[10px] text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded-full">
                      <Sparkles className="h-3 w-3" /> AI Featured
                    </span>
                  )}
                </div>

                {/* Title & Excerpt & Cover Image */}
                <Link href={publicUrl} className="flex justify-between items-start gap-6 group/link cursor-pointer">
                  <div className="flex-1 flex flex-col gap-1">
                    <h2 className="text-xl sm:text-2xl font-serif font-bold text-gray-900 group-hover/link:text-neutral-700 transition-colors leading-tight">
                      {article.title || "Untitled Story"}
                    </h2>
                    <p className="text-sm text-gray-500 leading-relaxed line-clamp-2 mt-1 font-sans">
                      {article.excerpt || truncateContent(article.content)}
                    </p>
                  </div>
                  {article.coverImage && (
                    <div className="h-20 w-28 sm:h-24 sm:w-36 flex-shrink-0 rounded-2xl overflow-hidden bg-gray-50 border border-gray-100">
                      <img
                        src={article.coverImage}
                        alt={article.title}
                        className="h-full w-full object-cover group-hover/link:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                </Link>

                {/* Article Footer Toolbar */}
                <div className="mt-2 flex items-center justify-between text-xs text-gray-400 font-medium select-none">
                  <div className="flex items-center gap-4 sm:gap-6">
                    <span className="bg-gray-100 text-gray-600 px-2.5 py-0.5 rounded-full text-[11px] font-semibold capitalize">
                      {article.generationMeta?.category || "General"}
                    </span>
                    <span>{getReadTime(article.content)}</span>
                  </div>

                  <div className="flex items-center gap-4">
                    {/* Like Button */}
                    <button
                      onClick={() => toggleLike(article._id)}
                      className={`flex items-center gap-1.5 p-1.5 rounded-full transition-all cursor-pointer ${
                        isLiked ? "text-red-500 font-bold" : "hover:text-gray-700"
                      }`}
                      title="Like story"
                    >
                      <Heart className={`h-4 w-4 ${isLiked ? "fill-red-500 text-red-500" : ""}`} />
                      <span className="text-xs">{getLikesCount(article._id)}</span>
                    </button>

                    {/* Comment Button */}
                    <button
                      onClick={() => setActiveArticleForComments(article)}
                      className="flex items-center gap-1.5 p-1.5 rounded-full hover:text-gray-700 transition-colors cursor-pointer"
                      title="View responses"
                    >
                      <MessageCircle className="h-4 w-4" />
                      <span className="text-xs">{getCommentsCount(article._id)}</span>
                    </button>

                    {/* Save / Bookmark Button */}
                    <button
                      onClick={() => toggleBookmark(article._id)}
                      className={`p-1.5 rounded-full transition-colors cursor-pointer ${
                        isBookmarked ? "text-black" : "hover:text-gray-700"
                      }`}
                      title={isBookmarked ? "Remove bookmark" : "Save story"}
                    >
                      <Bookmark className={`h-4 w-4 ${isBookmarked ? "fill-black" : ""}`} />
                    </button>
                  </div>
                </div>
              </article>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center text-gray-500 bg-gray-50/50 rounded-3xl p-8 border border-gray-100">
            <Sparkles className="h-8 w-8 text-gray-400 mb-3" />
            <h3 className="text-base font-serif font-bold text-gray-900">No stories found</h3>
            <p className="text-xs text-gray-500 max-w-sm mt-1 mb-4">
              Try selecting a different topic or view the "For You" tab.
            </p>
            {selectedTopic && (
              <button
                onClick={onClearTopic}
                className="px-4 py-2 bg-black text-white text-xs font-bold rounded-full hover:bg-neutral-800 transition-colors"
              >
                Clear Topic Filter
              </button>
            )}
          </div>
        )}
      </div>

      {/* Slide-over Comments Drawer */}
      <CommentsDrawer
        isOpen={!!activeArticleForComments}
        onClose={() => setActiveArticleForComments(null)}
        article={activeArticleForComments}
        onCommentAdded={handleCommentAdded}
      />
    </div>
  );
}
