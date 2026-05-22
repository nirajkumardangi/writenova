"use client";

import Link from "next/link";
import { Calendar, Sparkles, Trash2 } from "lucide-react";

export default function StoryCard({ article, onDelete }) {
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
    return text.length > 140 ? text.substring(0, 140) + "..." : text;
  };

  const displayDate = article.status === "draft"
    ? (article.updatedAt || article.createdAt)
    : article.createdAt;

  return (
    <div className="py-5 first:pt-0 last:pb-0 group">
      <div className="flex items-start justify-between gap-4">
        <Link href={`/editor/${article._id}`} className="flex-1 min-w-0">
          <h3 className="text-lg font-serif font-bold text-gray-900 group-hover:text-neutral-700 transition-colors leading-snug">
            {article.title || "Untitled"}
          </h3>
          <p className="mt-1 text-sm text-gray-500 leading-relaxed line-clamp-2">
            {article.excerpt || truncateContent(article.content)}
          </p>
          <div className="mt-2.5 flex items-center gap-3 text-xs text-gray-400 font-medium">
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {formatDate(displayDate)}
            </span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                article.status === "published"
                  ? "bg-emerald-50 text-emerald-600"
                  : "bg-amber-50 text-amber-600"
              }`}
            >
              {article.status}
            </span>
            {article.aiGenerated && (
              <span className="flex items-center gap-1 text-indigo-500">
                <Sparkles className="h-3 w-3" />
                AI Generated
              </span>
            )}
          </div>
        </Link>
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onDelete(article._id);
          }}
          className="p-2 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
          title={`Delete ${article.status === "draft" ? "draft" : "article"}`}
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
