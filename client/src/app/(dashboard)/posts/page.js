"use client";

import { useState, useEffect } from "react";
import { FileText, Plus, Loader2 } from "lucide-react";
import Link from "next/link";
import { useArticleStore } from "@/store/articleStore";
import StoryCard from "@/components/dashboard/StoryCard";

export default function StoriesPage() {
  const { articles, loading, fetchArticles, deleteArticle } = useArticleStore();
  const [activeFilter, setActiveFilter] = useState("all");

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  const drafts = articles.filter((a) => a.status === "draft");
  const published = articles.filter((a) => a.status === "published");
  const filteredArticles = activeFilter === "all" ? articles : activeFilter === "draft" ? drafts : published;

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this article?")) return;
    await deleteArticle(id);
  };



  return (
    <div className="mx-auto max-w-3xl py-8 px-4 sm:px-6">
      <div className="border-b border-gray-200 pb-5 mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-serif font-bold text-gray-900 flex items-center gap-3">
            <FileText className="h-8 w-8 stroke-[1.5]" />
            Your Stories
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Write, manage and view your drafts and published stories.
          </p>
        </div>
        <Link
          href="/editor/new"
          className="flex items-center gap-2 px-5 py-2.5 bg-black text-white rounded-full text-sm font-medium hover:bg-black/90 active:scale-95 transition-all shadow-sm"
        >
          <Plus className="h-4 w-4" />
          New Story
        </Link>
      </div>

      <div className="flex flex-col gap-8">
        {/* Filter Tabs */}
        <div className="flex gap-6 border-b border-gray-100 pb-2">
          {[
            { key: "all", label: `All (${articles.length})` },
            { key: "draft", label: `Drafts (${drafts.length})` },
            { key: "published", label: `Published (${published.length})` },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveFilter(tab.key)}
              className={`text-sm pb-2 px-1 transition-colors cursor-pointer ${
                activeFilter === tab.key
                  ? "font-semibold border-b-2 border-black text-black"
                  : "font-medium text-gray-500 hover:text-black"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-8 w-8 text-black animate-spin stroke-[1.5]" />
            <span className="mt-3 text-sm text-gray-500 font-medium">Loading stories...</span>
          </div>
        )}

        {/* Articles List */}
        {!loading && filteredArticles.length > 0 && (
          <div className="flex flex-col divide-y divide-gray-100">
            {filteredArticles.map((article) => (
              <StoryCard
                key={article._id}
                article={article}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredArticles.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="rounded-full bg-gray-50 p-4 mb-4">
              <FileText className="h-8 w-8 text-gray-400 stroke-[1.5]" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              {activeFilter === "all" ? "No stories yet" : `No ${activeFilter} stories`}
            </h3>
            <p className="text-sm text-gray-500 max-w-md">
              Click &quot;New Story&quot; to start writing your first story on WriteNova.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
