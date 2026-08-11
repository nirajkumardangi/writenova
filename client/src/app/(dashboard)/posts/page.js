"use client";

import { useState, useEffect } from "react";
import { FileText, Plus, Loader2, Sparkles } from "lucide-react";
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
    if (!window.confirm("Are you sure you want to delete this story?")) return;
    await deleteArticle(id);
  };

  return (
    <div className="mx-auto max-w-4xl py-8 px-4 sm:px-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="border-b border-gray-100 pb-6 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-gray-900 flex items-center gap-3">
            <FileText className="h-8 w-8 text-black stroke-[1.5]" />
            Your Stories
          </h1>
          <p className="mt-1.5 text-sm text-gray-500 font-sans">
            Write, manage, and view your drafts and published stories.
          </p>
        </div>

        <Link
          href="/editor/new"
          className="flex items-center gap-2 px-5 py-2.5 bg-black hover:bg-neutral-800 text-white rounded-full text-xs font-bold transition-all shadow-sm self-start sm:self-auto cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          New Story
        </Link>
      </div>

      <div className="flex flex-col gap-6">
        {/* Filter Tabs */}
        <div className="flex gap-6 border-b border-gray-100 pb-2 select-none">
          {[
            { key: "all", label: `All Stories (${articles.length})` },
            { key: "draft", label: `Drafts (${drafts.length})` },
            { key: "published", label: `Published (${published.length})` },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveFilter(tab.key)}
              className={`text-xs pb-2.5 px-1 transition-colors cursor-pointer ${
                activeFilter === tab.key
                  ? "font-bold border-b-2 border-black text-black"
                  : "font-semibold text-gray-400 hover:text-gray-900"
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
            <span className="mt-3 text-xs text-gray-500 font-medium">Loading your stories...</span>
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
          <div className="flex flex-col items-center justify-center py-20 text-center bg-gray-50/50 border border-gray-100 rounded-3xl p-8">
            <div className="rounded-full bg-white border border-gray-100 p-4 mb-4 shadow-sm">
              <FileText className="h-8 w-8 text-gray-400 stroke-[1.5]" />
            </div>
            <h3 className="text-lg font-serif font-bold text-gray-900 mb-1">
              {activeFilter === "all" ? "No stories written yet" : `No ${activeFilter} stories found`}
            </h3>
            <p className="text-xs text-gray-500 max-w-sm mb-6 font-sans leading-relaxed">
              Start sharing your thoughts, insights, or use WriteNova AI to generate your first draft in seconds.
            </p>
            <Link
              href="/editor/new"
              className="px-5 py-2.5 bg-black hover:bg-neutral-800 text-white rounded-full text-xs font-bold transition-all flex items-center gap-2 shadow-sm"
            >
              <Sparkles className="h-3.5 w-3.5 text-indigo-400" /> Start Writing
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
