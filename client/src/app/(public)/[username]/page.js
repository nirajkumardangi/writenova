"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { BookOpen, Calendar, Sparkles, Loader2, FileText, Heart, Bookmark, MessageCircle, UserPlus, Check } from "lucide-react";
import api from "@/lib/api";
import Link from "next/link";
import { getStorySlug } from "@/lib/slugify";
import { useCurrentUser } from "@/features/auth/hooks";
import CommentsDrawer from "@/components/dashboard/CommentsDrawer";

export default function UserPublicPage() {
  const { user: currentUser } = useCurrentUser();
  const params = useParams();
  const username = params?.username;

  const [profileUser, setProfileUser] = useState(null);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(0);
  const [likes, setLikes] = useState({});
  const [bookmarks, setBookmarks] = useState({});
  const [activeArticleForComments, setActiveArticleForComments] = useState(null);

  useEffect(() => {
    if (!username) return;

    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/users/public/${username}`);
        if (res.data.success) {
          setProfileUser(res.data.user);
          setArticles(res.data.articles || []);

          if (res.data.user?._id) {
            try {
              const followRes = await api.get(`/social/follow/${res.data.user._id}`);
              if (followRes.data.success) {
                setIsFollowing(followRes.data.isFollowing);
                setFollowerCount(followRes.data.followerCount);
              }
            } catch (fErr) {
              console.warn("Could not check follow status:", fErr);
            }
          }
        }
      } catch (err) {
        console.error("Failed to fetch user profile:", err);
        setError("User profile not found");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [username]);

  const toggleFollow = async () => {
    if (!profileUser?._id) return;
    const isCurrentlyFollowing = isFollowing;
    setIsFollowing(!isCurrentlyFollowing);
    setFollowerCount((prev) => (isCurrentlyFollowing ? Math.max(0, prev - 1) : prev + 1));

    try {
      const res = await api.post(`/social/follow/${profileUser._id}`);
      if (res.data.success) {
        setIsFollowing(res.data.following);
        setFollowerCount(res.data.followerCount);
      }
    } catch (err) {
      console.error("Failed to toggle follow:", err);
      setIsFollowing(isCurrentlyFollowing);
      setFollowerCount((prev) => (isCurrentlyFollowing ? prev + 1 : Math.max(0, prev - 1)));
    }
  };

  const toggleLike = async (id) => {
    const isCurrentlyLiked = !!likes[id];
    setLikes((prev) => ({ ...prev, [id]: !isCurrentlyLiked }));
    try {
      const res = await api.post(`/social/like/${id}`);
      if (res.data.success) {
        setLikes((prev) => ({ ...prev, [id]: res.data.liked }));
      }
    } catch (err) {
      console.error("Failed to toggle like:", err);
      setLikes((prev) => ({ ...prev, [id]: isCurrentlyLiked }));
    }
  };

  const toggleBookmark = async (id) => {
    const isCurrentlyBookmarked = !!bookmarks[id];
    setBookmarks((prev) => ({ ...prev, [id]: !isCurrentlyBookmarked }));
    try {
      const res = await api.post(`/social/bookmark/${id}`);
      if (res.data.success) {
        setBookmarks((prev) => ({ ...prev, [id]: res.data.bookmarked }));
      }
    } catch (err) {
      console.error("Failed to toggle bookmark:", err);
      setBookmarks((prev) => ({ ...prev, [id]: isCurrentlyBookmarked }));
    }
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

  const getReadTime = (html) => {
    if (!html) return "1 min read";
    const text = html.replace(/<[^>]+>/g, "");
    const words = text.split(/\s+/).filter(Boolean).length;
    const minutes = Math.max(1, Math.ceil(words / 200));
    return `${minutes} min read`;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 text-black animate-spin stroke-[1.5]" />
        <span className="mt-3 text-xs text-gray-500 font-medium">Loading profile...</span>
      </div>
    );
  }

  if (error || !profileUser) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <h3 className="text-xl font-serif font-bold text-gray-900 mb-2">User Not Found</h3>
        <p className="text-xs text-gray-500 max-w-sm mb-6">
          The author profile @{username} could not be found or does not exist.
        </p>
        <Link
          href="/dashboard"
          className="px-5 py-2.5 bg-black text-white text-xs font-bold rounded-full hover:bg-neutral-800 transition-colors"
        >
          Return to Dashboard
        </Link>
      </div>
    );
  }

  const authorName = profileUser.username || profileUser.email?.split("@")[0] || "Author";
  const initials = authorName.substring(0, 2).toUpperCase();
  const authorBg = getAuthorBg(profileUser._id);
  const isOwner = currentUser && (currentUser.username === profileUser.username || currentUser._id === profileUser._id);

  return (
    <div className="mx-auto max-w-4xl py-8 px-4 sm:px-6 animate-in fade-in duration-300">
      {/* Profile Header Card */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 border-b border-gray-100 pb-8 mb-8 text-center sm:text-left">
        {profileUser.avatar ? (
          <img
            src={profileUser.avatar}
            alt={authorName}
            className="h-24 w-24 rounded-full object-cover shadow-md select-none border-2 border-gray-100"
          />
        ) : (
          <div
            className={`h-24 w-24 rounded-full flex items-center justify-center font-bold text-3xl shadow-md select-none ${authorBg}`}
          >
            {initials}
          </div>
        )}

        <div className="flex-1 flex flex-col gap-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h1 className="text-3xl font-serif font-bold text-gray-900">
                {authorName}
              </h1>
              <p className="text-xs text-gray-400 font-semibold mt-0.5">@{profileUser.username || "user"}</p>
            </div>

            {!isOwner && (
              <button
                onClick={toggleFollow}
                className={`flex items-center gap-1.5 px-5 py-2 rounded-full text-xs font-bold transition-all self-center sm:self-auto cursor-pointer border ${
                  isFollowing
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : "bg-black text-white hover:bg-neutral-800 border-black"
                }`}
              >
                {isFollowing ? <Check className="h-3.5 w-3.5" /> : <UserPlus className="h-3.5 w-3.5" />}
                {isFollowing ? "Following" : "Follow Writer"}
              </button>
            )}
          </div>

          <p className="text-sm text-gray-600 leading-relaxed max-w-lg mt-1 font-sans">
            {profileUser.bio || "Writer on WriteNova. Sharing ideas, insights, and stories."}
          </p>

          <div className="flex items-center gap-6 mt-3 text-xs text-gray-400 justify-center sm:justify-start font-medium">
            <span className="flex items-center gap-1.5">
              <BookOpen className="h-4 w-4 text-gray-400" />
              <strong className="text-gray-900">{articles.length}</strong> {articles.length === 1 ? "Story" : "Stories"} published
            </span>
            <span>·</span>
            <span className="flex items-center gap-1.5">
              <strong className="text-gray-900">{followerCount}</strong> Followers
            </span>
          </div>
        </div>
      </div>

      {/* Published Stories */}
      <div>
        <h2 className="text-xl font-serif font-bold text-gray-900 mb-6 border-b border-gray-100 pb-2">
          Published Stories
        </h2>

        {articles.length > 0 ? (
          <div className="flex flex-col gap-8">
            {articles.map((story) => {
              const readTime = getReadTime(story.content);
              const dateVal = formatDate(story.createdAt);
              const excerptVal = story.excerpt || (story.content ? story.content.replace(/<[^>]+>/g, "").substring(0, 150) + "..." : "");
              const isLiked = !!likes[story._id];
              const isBookmarked = !!bookmarks[story._id];

              return (
                <article
                  key={story._id}
                  className="flex flex-col gap-3 pb-8 border-b border-gray-100/80 last:border-b-0 group"
                >
                  <div className="flex items-center gap-2 text-xs text-gray-400 font-medium">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {dateVal}
                    </span>
                    <span>•</span>
                    <span>{readTime}</span>
                    {story.aiGenerated && (
                      <>
                        <span>•</span>
                        <span className="flex items-center gap-1 text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded-full text-[10px]">
                          <Sparkles className="h-3 w-3" />
                          AI Featured
                        </span>
                      </>
                    )}
                  </div>

                  <Link
                    href={`/${username}/${getStorySlug(story)}`}
                    className="flex justify-between items-start gap-6 group/link cursor-pointer"
                  >
                    <div className="flex-1 flex flex-col gap-1">
                      <h3 className="text-xl font-serif font-bold text-gray-900 group-hover/link:text-neutral-700 transition-colors leading-tight">
                        {story.title || "Untitled Story"}
                      </h3>
                      <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed mt-1 font-sans">
                        {excerptVal}
                      </p>
                    </div>
                    {story.coverImage && (
                      <div className="h-20 w-28 sm:h-24 sm:w-36 flex-shrink-0 rounded-2xl overflow-hidden bg-gray-50 border border-gray-100">
                        <img
                          src={story.coverImage}
                          alt={story.title}
                          className="h-full w-full object-cover group-hover/link:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                  </Link>

                  {/* Actions */}
                  <div className="flex items-center justify-between mt-2 text-xs text-gray-400 font-medium select-none">
                    <span className="bg-gray-100 text-gray-600 px-2.5 py-0.5 rounded-full text-[11px] font-semibold capitalize">
                      {story.generationMeta?.category || "General"}
                    </span>

                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => toggleLike(story._id)}
                        className={`flex items-center gap-1.5 p-1 rounded-full hover:text-gray-700 transition-colors cursor-pointer ${
                          isLiked ? "text-red-500 font-bold" : ""
                        }`}
                      >
                        <Heart className={`h-4 w-4 ${isLiked ? "fill-red-500 text-red-500" : ""}`} />
                      </button>

                      <button
                        onClick={() => setActiveArticleForComments(story)}
                        className="flex items-center gap-1.5 p-1 rounded-full hover:text-gray-700 transition-colors cursor-pointer"
                      >
                        <MessageCircle className="h-4 w-4" />
                      </button>

                      <button
                        onClick={() => toggleBookmark(story._id)}
                        className={`p-1 rounded-full transition-colors cursor-pointer ${
                          isBookmarked ? "text-black" : "hover:text-gray-700"
                        }`}
                      >
                        <Bookmark className={`h-4 w-4 ${isBookmarked ? "fill-black" : ""}`} />
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center text-gray-500 bg-gray-50/50 rounded-3xl p-8 border border-gray-100">
            <FileText className="h-8 w-8 text-gray-400 mb-2 stroke-[1.5]" />
            <h3 className="text-base font-serif font-bold text-gray-900">No published stories yet</h3>
            <p className="text-xs text-gray-500 max-w-sm mt-1">
              @{username} has not published any public stories on WriteNova yet.
            </p>
          </div>
        )}
      </div>

      {/* Comments Drawer */}
      <CommentsDrawer
        isOpen={!!activeArticleForComments}
        onClose={() => setActiveArticleForComments(null)}
        article={activeArticleForComments}
      />
    </div>
  );
}
