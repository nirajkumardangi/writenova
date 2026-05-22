"use client";

import { useState, useEffect } from "react";
import { Bookmark, Heart, MessageCircle, MoreHorizontal, Loader2 } from "lucide-react";
import api from "@/lib/api";
import Link from "next/link";

export default function Feed() {
  const [activeTab, setActiveTab] = useState("for-you");
  const [bookmarks, setBookmarks] = useState({});
  const [likes, setLikes] = useState({});
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

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
    setBookmarks((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const toggleLike = (id) => {
    setLikes((prev) => ({
      ...prev,
      [id]: !prev[id],
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
    const code = id.toString().split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return (code % 150) + 12;
  };

  const getCommentsCount = (id) => {
    if (!id) return 0;
    const code = id.toString().split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return (code % 25) + 2;
  };

  const activeStories = activeTab === "featured"
    ? articles.filter((a) => a.aiGenerated)
    : articles;

  return (
    <div className="mx-auto max-w-3xl py-8 px-4 sm:px-6">
      {/* Navigation Tabs */}
      <div className="border-b border-gray-100 mb-8 sticky top-0 bg-white z-10">
        <nav className="-mb-px flex gap-8 ">
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
        </nav>
      </div>

      {/* Stories list */}
      <div className="flex flex-col gap-10">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-8 w-8 text-black animate-spin stroke-[1.5]" />
            <span className="mt-3 text-sm text-gray-500 font-medium">Loading your feed...</span>
          </div>
        ) : activeStories.length > 0 ? (
          activeStories.map((story) => {
            const storyId = story._id;
            const isBookmarked = !!bookmarks[storyId];
            const isLiked = !!likes[storyId];

            const authorVal = story.author?.username || story.author?.email?.split("@")[0] || "Anonymous";
            const initialsVal = authorVal.substring(0, 2).toUpperCase();
            const authorBgVal = getAuthorBg(story.author?._id || storyId);
            const dateVal = formatDate(story.createdAt);
            const titleVal = story.title || "Untitled";
            const excerptVal = story.excerpt || truncateContent(story.content);
            const topicVal = story.generationMeta?.category || "General";
            const readTimeVal = getReadTime(story.content);

            const likesCountVal = getLikesCount(storyId);
            const commentsCountVal = getCommentsCount(storyId);
            const displayLikes = likesCountVal + (isLiked ? 1 : 0);

            return (
              <article
                key={storyId}
                className="flex flex-col gap-3 pb-8 border-b border-gray-100/70 last:border-b-0 group"
              >
                {/* Author line */}
                <div className="flex items-center gap-2">
                  <div
                    className={`h-6 w-6 rounded-full flex items-center justify-center font-bold text-[9px] ${authorBgVal}`}
                  >
                    {initialsVal}
                  </div>
                  <span className="text-xs font-semibold text-gray-900">
                    {authorVal}
                  </span>
                  <span className="text-xs text-gray-400 select-none">•</span>
                  <span className="text-xs text-gray-500">{dateVal}</span>
                </div>

                {/* Title & Excerpt & Image */}
                <Link
                  href={`/${authorVal}/${storyId}`}
                  className="flex justify-between items-start gap-6 group/link cursor-pointer block"
                >
                  <div className="flex-1 flex flex-col gap-1">
                    <h2 className="text-xl sm:text-2xl font-serif font-bold text-gray-900 group-hover:text-neutral-800 group-hover/link:text-neutral-800 transition-colors leading-tight">
                      {titleVal}
                    </h2>
                    <p className="text-sm sm:text-[15px] text-gray-500 line-clamp-3 leading-relaxed mt-1 font-sans">
                      {excerptVal}
                    </p>
                  </div>
                  {story.coverImage && (
                    <div className="h-16 w-24 sm:h-20 sm:w-32 flex-shrink-0 rounded-xl overflow-hidden bg-gray-50 border border-gray-100/80">
                      <img
                        src={story.coverImage}
                        alt={titleVal}
                        className="h-full w-full object-cover group-hover:scale-105 group-hover/link:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    </div>
                  )}
                </Link>

                {/* Footer of the article */}
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-3 sm:gap-5 flex-wrap">
                    {story.topics && story.topics.length > 0 ? (
                      story.topics.map((t) => (
                        <span key={t} className="text-[11px] font-medium bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full capitalize">
                          {t}
                        </span>
                      ))
                    ) : (
                      <span className="text-[11px] font-medium bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">
                        {topicVal}
                      </span>
                    )}
                    <span className="text-xs text-gray-400">
                      {readTimeVal}
                    </span>

                    {/* Likes (Heart Button) */}
                    <button
                      onClick={() => toggleLike(storyId)}
                      className={`flex items-center gap-1.5 text-xs transition-colors cursor-pointer select-none ${
                        isLiked
                          ? "text-rose-600 font-semibold"
                          : "text-gray-400 hover:text-black"
                      }`}
                      aria-label={isLiked ? "Unlike story" : "Like story"}
                    >
                      <Heart
                        className={`h-4 w-4 transition-transform duration-200 ${
                          isLiked ? "fill-rose-500 text-rose-500 scale-110" : ""
                        }`}
                      />
                      <span>{displayLikes}</span>
                    </button>

                    {/* Comments (Message Circle) */}
                    <button
                      className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-black transition-colors cursor-pointer select-none"
                      aria-label={`${commentsCountVal} comments`}
                    >
                      <MessageCircle className="h-4 w-4" />
                      <span>{commentsCountVal}</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Bookmark Button */}
                    <button
                      onClick={() => toggleBookmark(storyId)}
                      className={`p-1.5 rounded-full hover:bg-gray-100 transition-colors cursor-pointer ${
                        isBookmarked
                          ? "text-amber-500"
                          : "text-gray-400 hover:text-black"
                      }`}
                      aria-label={
                        isBookmarked ? "Remove bookmark" : "Bookmark article"
                      }
                    >
                      <Bookmark
                        className="h-[18px] w-[18px]"
                        fill={isBookmarked ? "currentColor" : "none"}
                      />
                    </button>

                    {/* Options Button */}
                    <button
                      className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-black transition-colors cursor-pointer"
                      aria-label="More options"
                    >
                      <MoreHorizontal className="h-[18px] w-[18px]" />
                    </button>
                  </div>
                </div>
              </article>
            );
          })
        ) : (
          <div className="text-gray-500 text-center py-20">
            Your feed is currently empty.
          </div>
        )}
      </div>
    </div>
  );
}
