"use client";

import { useEffect } from "react";
import { Bookmark, Loader2, Plus } from "lucide-react";
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
    <div className="mx-auto max-w-3xl py-8 px-4 sm:px-6">
      <div className="border-b border-gray-200 pb-5 mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-serif font-bold text-gray-900 flex items-center gap-3">
            <Bookmark className="h-8 w-8 stroke-[1.5]" />
            Your Drafts
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Continue working on your unpublished stories.
          </p>
        </div>
        <Link
          href="/editor/new"
          className="flex items-center gap-2 px-5 py-2.5 bg-black text-white rounded-full text-sm font-medium hover:bg-black/90 active:scale-95 transition-all shadow-sm"
        >
          <Plus className="h-4 w-4" />
          New Draft
        </Link>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="h-8 w-8 text-black animate-spin stroke-[1.5]" />
          <span className="mt-3 text-sm text-gray-500 font-medium">Loading drafts...</span>
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
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="rounded-full bg-gray-50 p-4 mb-4">
            <Bookmark className="h-8 w-8 text-gray-400 stroke-[1.5]" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">
            No drafts yet
          </h3>
          <p className="text-sm text-gray-500 max-w-md">
            Click &quot;New Draft&quot; to start writing your first story on WriteNova.
          </p>
        </div>
      )}
    </div>
  );
}
