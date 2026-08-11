"use client";

import { useEffect } from "react";
import { Bookmark, Loader2, Plus, Sparkles } from "lucide-react";
import Link from "next/link";
import { useArticleStore } from "@/store/articleStore";
import StoryCard from "@/components/dashboard/StoryCard";

export default function DraftsPage() {
  const { articles, loading, fetchArticles, deleteArticle } = useArticleStore();

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  const drafts = articles.filter((a) => a.status === "draft");

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this draft?")) return;
    await deleteArticle(id);
  };

  return (
    <div className="mx-auto max-w-4xl py-8 px-4 sm:px-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="border-b border-gray-100 pb-6 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-gray-900 flex items-center gap-3">
            <Bookmark className="h-8 w-8 text-black stroke-[1.5]" />
            Your Drafts
          </h1>
          <p className="mt-1.5 text-sm text-gray-500 font-sans">
            Continue working on your unpublished stories and AI generated drafts.
          </p>
        </div>

        <Link
          href="/editor/new"
          className="flex items-center gap-2 px-5 py-2.5 bg-black hover:bg-neutral-800 text-white rounded-full text-xs font-bold transition-all shadow-sm self-start sm:self-auto cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          New Draft
        </Link>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="h-8 w-8 text-black animate-spin stroke-[1.5]" />
          <span className="mt-3 text-xs text-gray-500 font-medium">Loading drafts...</span>
        </div>
      )}

      {/* Drafts List */}
      {!loading && drafts.length > 0 && (
        <div className="flex flex-col divide-y divide-gray-100">
          {drafts.map((draft) => (
            <StoryCard
              key={draft._id}
              article={draft}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && drafts.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-gray-50/50 border border-gray-100 rounded-3xl p-8">
          <div className="rounded-full bg-white border border-gray-100 p-4 mb-4 shadow-sm">
            <Bookmark className="h-8 w-8 text-gray-400 stroke-[1.5]" />
          </div>
          <h3 className="text-lg font-serif font-bold text-gray-900 mb-1">
            No drafts in progress
          </h3>
          <p className="text-xs text-gray-500 max-w-sm mb-6 font-sans leading-relaxed">
            All your stories are either published or you haven't started a new draft yet.
          </p>
          <Link
            href="/editor/new"
            className="px-5 py-2.5 bg-black hover:bg-neutral-800 text-white rounded-full text-xs font-bold transition-all flex items-center gap-2 shadow-sm"
          >
            <Sparkles className="h-3.5 w-3.5 text-indigo-400" /> Start New Draft
          </Link>
        </div>
      )}
    </div>
  );
}
