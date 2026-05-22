"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { BookOpen, Calendar, Sparkles, Loader2, FileText } from "lucide-react";
import api from "@/lib/api";
import Link from "next/link";

export default function UserPublicPage() {
  const params = useParams();
  const username = params?.username;

  const [profileUser, setProfileUser] = useState(null);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!username) return;

    const fetchPublicProfile = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/users/public/${username}`);
        if (res.data.success) {
          setProfileUser(res.data.user);
          setArticles(res.data.articles || []);
        }
      } catch (err) {
        console.error("Failed to load profile:", err);
        setError("User not found or failed to load profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchPublicProfile();
  }, [username]);

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

  const getReadTime = (html) => {
    if (!html) return "1 min read";
    const text = html.replace(/<[^>]+>/g, "");
    const words = text.split(/\s+/).filter(Boolean).length;
    const minutes = Math.max(1, Math.ceil(words / 200));
    return `${minutes} min read`;
  };

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 text-black animate-spin stroke-[1.5]" />
          <span className="text-sm text-gray-500 font-medium">Loading profile...</span>
        </div>
      </div>
    );
  }

  if (error || !profileUser) {
    return (
      <div className="mx-auto max-w-3xl py-12 px-4 sm:px-6 text-center animate-in fade-in duration-200">
        <h2 className="text-2xl font-serif font-bold text-gray-900 mb-2">User Not Found</h2>
        <p className="text-gray-500 mb-6">{error || "The profile you are looking for does not exist."}</p>
        <Link href="/dashboard" className="px-5 py-2.5 bg-black text-white rounded-full text-sm font-semibold hover:bg-neutral-800">
          Go back home
        </Link>
      </div>
    );
  }

  const authorName = profileUser.username || profileUser.email?.split("@")[0] || "Anonymous";
  const initials = authorName.substring(0, 2).toUpperCase();
  const authorBg = getAuthorBg(profileUser._id);

  return (
    <div className="mx-auto max-w-3xl py-12 px-4 sm:px-6 animate-in fade-in duration-200">
      {/* Profile Header Card */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 border-b border-gray-100 pb-10 mb-10 text-center sm:text-left">
        {/* Large Avatar */}
        <div
          className={`h-24 w-24 rounded-full flex items-center justify-center font-bold text-3xl shadow-md select-none ${authorBg}`}
        >
          {initials}
        </div>
        
        {/* Profile Info */}
        <div className="flex-1 flex flex-col gap-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h1 className="text-3xl font-serif font-bold text-gray-900">
                {authorName}
              </h1>
              <p className="text-sm text-gray-400 font-medium mt-0.5">@{profileUser.username || "user"}</p>
            </div>
          </div>
          
          <p className="text-sm text-gray-500 leading-relaxed max-w-md mt-1">
            Writer on WriteNova. Sharing ideas, insights, and stories.
          </p>

          <div className="flex items-center gap-6 mt-3 text-xs text-gray-400 justify-center sm:justify-start">
            <span className="flex items-center gap-1.5 font-medium">
              <BookOpen className="h-4 w-4 text-gray-400" />
              <strong>{articles.length}</strong> {articles.length === 1 ? "Story" : "Stories"} published
            </span>
          </div>
        </div>
      </div>

      {/* Stories list */}
      <div>
        <h2 className="text-xl font-serif font-bold text-gray-900 mb-8 border-b border-gray-100 pb-2">
          Published Stories
        </h2>

        {articles.length > 0 ? (
          <div className="flex flex-col gap-10">
            {articles.map((story) => {
              const readTime = getReadTime(story.content);
              const dateVal = formatDate(story.createdAt);
              const excerptVal = story.excerpt || (story.content ? story.content.replace(/<[^>]+>/g, "").substring(0, 150) + "..." : "");
              
              return (
                <article
                  key={story._id}
                  className="flex flex-col gap-3 pb-8 border-b border-gray-100/70 last:border-b-0 group"
                >
                  <div className="flex items-center gap-2 text-xs text-gray-400 font-medium">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {dateVal}
                    </span>
                    <span>•</span>
                    <span>{readTime}</span>
                    {story.aiGenerated && (
                      <>
                        <span>•</span>
                        <span className="flex items-center gap-1 text-indigo-500 font-sans">
                          <Sparkles className="h-3 w-3" />
                          AI Generated
                        </span>
                      </>
                    )}
                  </div>

                  {/* Title & Excerpt & Image */}
                  <Link
                    href={`/${username}/${story._id}`}
                    className="flex justify-between items-start gap-6 group/link cursor-pointer block"
                  >
                    <div className="flex-1 flex flex-col gap-1">
                      <h3 className="text-xl font-serif font-bold text-gray-900 group-hover:text-neutral-800 group-hover/link:text-neutral-800 transition-colors leading-tight">
                        {story.title || "Untitled"}
                      </h3>
                      <p className="text-sm text-gray-500 line-clamp-3 leading-relaxed mt-1 font-sans">
                        {excerptVal}
                      </p>
                    </div>
                    {story.coverImage && (
                      <div className="h-16 w-24 sm:h-20 sm:w-32 flex-shrink-0 rounded-xl overflow-hidden bg-gray-50 border border-gray-100/80">
                        <img
                          src={story.coverImage}
                          alt={story.title}
                          className="h-full w-full object-cover group-hover:scale-105 group-hover/link:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                  </Link>

                  {/* Footer / Topics */}
                  <div className="flex items-center gap-2 mt-1">
                    {story.topics && story.topics.length > 0 ? (
                      story.topics.map((t) => (
                        <span key={t} className="text-[10px] font-medium bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full capitalize">
                          {t}
                        </span>
                      ))
                    ) : (
                      <span className="text-[10px] font-medium bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                        {story.generationMeta?.category || "General"}
                      </span>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center text-gray-500">
            <div className="rounded-full bg-gray-50 p-4 mb-4">
              <FileText className="h-8 w-8 text-gray-400 stroke-[1.5]" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No published stories</h3>
            <p className="text-sm text-gray-500 max-w-md">
              Stories published by this user will appear here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
