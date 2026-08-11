"use client";

import { useState, useEffect } from "react";
import { Bookmark, Heart, MessageCircle, MoreHorizontal, Loader2, Sparkles, Filter, X, Users } from "lucide-react";
import api from "@/lib/api";
import Link from "next/link";
import { getStorySlug } from "@/lib/slugify";
import CommentsDrawer from "./CommentsDrawer";

export default function Feed({ selectedTopic, searchQuery, onClearTopic }) {
  const [activeTab, setActiveTab] = useState("for-you");
  const [bookmarks, setBookmarks] = useState({});
  const [likes, setLikes] = useState({});
  const [likeCounts, setLikeCounts] = useState({});
  const [commentCounts, setCommentCounts] = useState({});
  const [followingIds, setFollowingIds] = useState(new Set());
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeArticleForComments, setActiveArticleForComments] = useState(null);

  useEffect(() => {
    const fetchFeedAndSocial = async () => {
      try {
        const res = await api.get("/editor/feed");
        if (res.data.success) {
          const feedArticles = res.data.articles || [];
          setArticles(feedArticles);

          if (feedArticles.length > 0) {
            const articleIds = feedArticles.map((a) => a._id);
            try {
              const socialRes = await api.post("/social/batch-status", { articleIds });
              if (socialRes.data.success) {
                const statuses = socialRes.data.statuses || {};
                const newLikes = {};
                const newBookmarks = {};
                const newLikeCounts = {};
                const newCommentCounts = {};

                for (const [id, status] of Object.entries(statuses)) {
                  newLikes[id] = status.liked;
                  newBookmarks[id] = status.bookmarked;
                  newLikeCounts[id] = status.likeCount;
                  newCommentCounts[id] = status.commentCount;
                }

                setLikes(newLikes);
                setBookmarks(newBookmarks);
                setLikeCounts(newLikeCounts);
                setCommentCounts(newCommentCounts);
              }
            } catch (socialErr) {
              console.warn("Failed to fetch batch social status:", socialErr);
            }
          }
        }
      } catch (err) {
        console.error("Failed to fetch feed articles:", err);
      } finally {
        setLoading(false);
      }
    };

    const fetchFollowing = async () => {
      try {
        const followRes = await api.get("/social/following");
        if (followRes.data.success && followRes.data.following) {
          const ids = new Set(followRes.data.following.map((u) => (u._id || u).toString()));
          setFollowingIds(ids);
        }
      } catch (fErr) {
        console.warn("Could not fetch user following list:", fErr);
      }
    };

    fetchFeedAndSocial();
    fetchFollowing();
  }, []);

  const toggleBookmark = async (id) => {
    setBookmarks((prev) => ({ ...prev, [id]: !prev[id] }));
    try {
      const res = await api.post(`/social/bookmark/${id}`);
      if (res.data.success) {
        setBookmarks((prev) => ({ ...prev, [id]: res.data.bookmarked }));
      }
    } catch (err) {
      console.error("Failed to toggle bookmark:", err);
      setBookmarks((prev) => ({ ...prev, [id]: !prev[id] }));
    }
  };

  const toggleLike = async (id) => {
    const isCurrentlyLiked = !!likes[id];
    setLikes((prev) => ({ ...prev, [id]: !isCurrentlyLiked }));
    setLikeCounts((prev) => ({
      ...prev,
      [id]: isCurrentlyLiked ? Math.max(0, (prev[id] || 1) - 1) : (prev[id] || 0) + 1,
    }));

    try {
      const res = await api.post(`/social/like/${id}`);
      if (res.data.success) {
        setLikes((prev) => ({ ...prev, [id]: res.data.liked }));
        setLikeCounts((prev) => ({ ...prev, [id]: res.data.likeCount }));
      }
    } catch (err) {
      console.error("Failed to toggle like:", err);
      setLikes((prev) => ({ ...prev, [id]: isCurrentlyLiked }));
      setLikeCounts((prev) => ({
        ...prev,
        [id]: isCurrentlyLiked ? (prev[id] || 0) + 1 : Math.max(0, (prev[id] || 1) - 1),
      }));
    }
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

  // Filter articles by search query, topic, and tab
  let filteredStories = articles;

  if (searchQuery) {
    const qLower = searchQuery.toLowerCase();
    filteredStories = filteredStories.filter((a) => {
      const titleMatch = (a.title || "").toLowerCase().includes(qLower);
      const excerptMatch = (a.excerpt || "").toLowerCase().includes(qLower);
      const authorMatch = (a.author?.username || "").toLowerCase().includes(qLower);
      const categoryMatch = (a.generationMeta?.category || "").toLowerCase().includes(qLower);
      return titleMatch || excerptMatch || authorMatch || categoryMatch;
    });
  }

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
    filteredStories = filteredStories.filter((a) => {
      const authorId = (a.author?._id || a.author || "").toString();
      return authorId && followingIds.has(authorId);
    });
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

          <div className="flex items-center gap-2">
            {searchQuery && (
              <div className="flex items-center gap-1.5 bg-blue-50 text-blue-700 text-xs px-3 py-1 rounded-full font-medium border border-blue-100">
                <Filter className="h-3 w-3" />
                <span>Search: "{searchQuery}"</span>
              </div>
            )}

            {selectedTopic && (
              <div className="flex items-center gap-2 bg-black text-white text-xs px-3 py-1 rounded-full font-medium">
                <Filter className="h-3 w-3" />
                <span>{selectedTopic}</span>
                <button onClick={onClearTopic} className="hover:text-gray-300 ml-1 cursor-pointer">
                  <X className="h-3 w-3" />
                </button>
              </div>
            )}
          </div>
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
            const currentLikeCount = likeCounts[article._id] ?? 0;
            const currentCommentCount = commentCounts[article._id] ?? 0;
            const publicUrl = `/${authorUsername}/${getStorySlug(article)}`;

            return (
              <article key={article._id} className="flex flex-col gap-3 pb-10 border-b border-gray-100/80 last:border-b-0 group">
                {/* Author row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    {article.author?.avatar ? (
                      <img
                        src={article.author.avatar}
                        alt={authorName}
                        className="h-6 w-6 rounded-full object-cover border border-gray-200"
                      />
                    ) : (
                      <div className={`h-6 w-6 rounded-full flex items-center justify-center font-bold text-[10px] ${authorBg}`}>
                        {initials}
                      </div>
                    )}
                    <div className="flex items-center gap-1.5 text-[13px]">
                      <Link href={`/${authorUsername}`} className="font-semibold text-black hover:underline">
                        {authorName}
                      </Link>
                      {article.aiGenerated && (
                        <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 text-[10px] font-medium px-1.5 py-0.5 rounded-full border border-amber-200/60">
                          <Sparkles className="h-2.5 w-2.5" />
                          AI
                        </span>
                      )}
                      <span className="text-gray-300">·</span>
                      <span className="text-gray-500 font-normal">{formatDate(article.createdAt)}</span>
                    </div>
                  </div>
                </div>

                {/* Main Content & Cover */}
                <div className="flex flex-col-reverse sm:flex-row gap-4 sm:gap-6 justify-between items-start">
                  <div className="flex-1 flex flex-col gap-1.5">
                    <Link href={publicUrl} className="group-hover:text-blue-600 transition-colors">
                      <h2 className="font-serif text-[1.25rem] sm:text-[1.4rem] font-bold text-[#171717] leading-snug tracking-[-0.01em]">
                        {article.title}
                      </h2>
                    </Link>
                    <p className="text-gray-600 font-sans text-[14px] leading-relaxed line-clamp-2">
                      {article.excerpt || truncateContent(article.content)}
                    </p>
                  </div>

                  {article.coverImage && (
                    <Link href={publicUrl} className="w-full sm:w-32 h-44 sm:h-24 flex-shrink-0 overflow-hidden rounded-xl bg-gray-100 border border-gray-100/80">
                      <img
                        src={article.coverImage}
                        alt={article.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </Link>
                  )}
                </div>

                {/* Footer Controls */}
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-4 text-[13px] text-gray-500 font-medium">
                    {article.generationMeta?.category && (
                      <span className="bg-gray-100 text-gray-700 px-2.5 py-0.5 rounded-full text-[11px] font-semibold">
                        {article.generationMeta.category}
                      </span>
                    )}
                    <span>{getReadTime(article.content)}</span>
                  </div>

                  <div className="flex items-center gap-3 sm:gap-5 text-gray-400">
                    <button
                      onClick={() => toggleLike(article._id)}
                      className={`flex items-center gap-1.5 text-xs font-semibold cursor-pointer transition-colors p-1.5 rounded-full hover:bg-gray-50 ${
                        isLiked ? "text-rose-600" : "hover:text-black"
                      }`}
                      title={isLiked ? "Unlike story" : "Like story"}
                    >
                      <Heart className={`h-4 w-4 ${isLiked ? "fill-rose-600 stroke-rose-600" : "stroke-[1.5]"}`} />
                      <span>{currentLikeCount}</span>
                    </button>

                    <button
                      onClick={() => setActiveArticleForComments(article)}
                      className="flex items-center gap-1.5 text-xs font-semibold cursor-pointer transition-colors p-1.5 rounded-full hover:bg-gray-50 hover:text-black"
                      title="Read responses"
                    >
                      <MessageCircle className="h-4 w-4 stroke-[1.5]" />
                      <span>{currentCommentCount}</span>
                    </button>

                    <button
                      onClick={() => toggleBookmark(article._id)}
                      className={`cursor-pointer transition-colors p-1.5 rounded-full hover:bg-gray-50 ${
                        isBookmarked ? "text-black" : "hover:text-black"
                      }`}
                      title={isBookmarked ? "Remove bookmark" : "Save story"}
                    >
                      <Bookmark className={`h-4 w-4 ${isBookmarked ? "fill-black stroke-black" : "stroke-[1.5]"}`} />
                    </button>
                  </div>
                </div>
              </article>
            );
          })
        ) : activeTab === "following" ? (
          <div className="flex flex-col items-center justify-center py-16 px-6 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200 text-center">
            <Users className="h-10 w-10 text-gray-400 mb-3 stroke-[1.5]" />
            <h3 className="font-serif font-bold text-lg text-gray-900 mb-1">No stories from writers you follow</h3>
            <p className="text-xs text-gray-500 max-w-sm">
              {followingIds.size === 0
                ? "You are not following any writers yet. Check out the 'Who to follow' section on the right to discover great authors!"
                : "The writers you follow haven't published any stories matching your current filter."}
            </p>
          </div>
        ) : (
          <div className="text-center py-16 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
            <p className="text-gray-500 font-medium">No stories found for this section.</p>
          </div>
        )}
      </div>

      {/* Real Comments Drawer */}
      {activeArticleForComments && (
        <CommentsDrawer
          isOpen={!!activeArticleForComments}
          article={activeArticleForComments}
          onClose={() => setActiveArticleForComments(null)}
          onCommentCountChange={handleCommentAdded}
        />
      )}
    </div>
  );
}
