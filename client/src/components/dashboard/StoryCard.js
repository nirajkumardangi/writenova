"use client";

import Link from "next/link";
import { Calendar, Sparkles, Trash2, Edit3, ExternalLink, BookOpen } from "lucide-react";
import { useCurrentUser } from "@/features/auth/hooks";
import { getStorySlug } from "@/lib/slugify";

export default function StoryCard({ article, onDelete }) {
  const { user } = useCurrentUser();
  const authorUsername = article.author?.username || user?.username || "author";

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

  const truncateContent = (html) => {
    if (!html) return "";
    const text = html.replace(/<[^>]+>/g, "");
    return text.length > 140 ? text.substring(0, 140) + "..." : text;
  };

  const displayDate = article.status === "draft"
    ? (article.updatedAt || article.createdAt)
    : article.createdAt;

  const publicUrl = `/${authorUsername}/${getStorySlug(article)}`;

  return (
    <div className="py-6 first:pt-0 last:pb-0 group transition-all">
      <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <Link href={`/editor/${article._id}`} className="group/title block">
            <h3 className="text-xl font-serif font-bold text-gray-900 group-hover/title:text-neutral-600 transition-colors leading-snug">
              {article.title || "Untitled Article"}
            </h3>
          </Link>

          <p className="mt-1.5 text-sm text-gray-500 leading-relaxed line-clamp-2 font-sans">
            {article.excerpt || truncateContent(article.content)}
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-gray-400 font-medium select-none">
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {formatDate(displayDate)}
            </span>

            <span>•</span>

            <span className="flex items-center gap-1">
              <BookOpen className="h-3.5 w-3.5" />
              {getReadTime(article.content)}
            </span>

            <span
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                article.status === "published"
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                  : "bg-amber-50 text-amber-700 border border-amber-100"
              }`}
            >
              {article.status}
            </span>

            {article.aiGenerated && (
              <span className="flex items-center gap-1 text-indigo-600 font-semibold bg-indigo-50/60 px-2 py-0.5 rounded-full text-[10px]">
                <Sparkles className="h-3 w-3" />
                AI Generated
              </span>
            )}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity self-end sm:self-start pt-1">
          {article.status === "published" && (
            <Link
              href={publicUrl}
              target="_blank"
              className="p-2 rounded-lg text-gray-400 hover:text-black hover:bg-gray-100 transition-all cursor-pointer"
              title="View live public story"
            >
              <ExternalLink className="h-4 w-4" />
            </Link>
          )}

          <Link
            href={`/editor/${article._id}`}
            className="p-2 rounded-lg text-gray-400 hover:text-black hover:bg-gray-100 transition-all cursor-pointer"
            title="Edit story"
          >
            <Edit3 className="h-4 w-4" />
          </Link>

          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onDelete(article._id);
            }}
            className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all cursor-pointer"
            title={`Delete ${article.status === "draft" ? "draft" : "article"}`}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
