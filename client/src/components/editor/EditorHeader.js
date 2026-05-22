"use client";

import Link from "next/link";
import { ChevronLeft, CheckCircle2, AlertCircle, Loader2, Globe } from "lucide-react";

export default function EditorHeader({
  postId,
  status,
  saveStatus,
  publishing,
  onPublishToggle,
}) {
  return (
    <div className="sticky top-0 z-20 bg-white border-b border-gray-100 px-4 py-3 sm:px-6 flex flex-wrap items-center justify-between gap-4">
      {/* Navigation & Status */}
      <div className="flex items-center gap-4">
        <Link
          href="/posts"
          className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-black transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Stories
        </Link>
        <div className="w-[1px] h-4 bg-gray-200" />

        {/* Save Status indicator */}
        {saveStatus === "saving" && (
          <span className="flex items-center gap-1.5 text-xs text-amber-600 font-medium">
            <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
            {status === "published" ? "Saving..." : "Saving draft..."}
          </span>
        )}
        {saveStatus === "saved" && (
          <span className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
            <CheckCircle2 className="h-3.5 w-3.5" />
            {status === "published" ? "Saved" : "Saved to drafts"}
          </span>
        )}
        {saveStatus === "error" && (
          <span className="flex items-center gap-1.5 text-xs text-red-600 font-medium">
            <AlertCircle className="h-3.5 w-3.5" />
            Offline / Save error
          </span>
        )}
        {saveStatus === "idle" && (
          <span className="flex items-center gap-1.5 text-xs text-gray-400 font-medium">
            <span className="h-2 w-2 rounded-full bg-gray-300" />
            Ready
          </span>
        )}
      </div>

      {/* Publish Button */}
      {postId && (
        <button
          onClick={onPublishToggle}
          disabled={publishing}
          className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer shadow-sm select-none border ${
            status === "published"
              ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 hover:text-emerald-800"
              : "bg-black text-white hover:bg-neutral-800 border border-black"
          }`}
        >
          {publishing ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Updating...
            </>
          ) : status === "published" ? (
            <>
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 fill-emerald-50" />
              Published
            </>
          ) : (
            <>
              <Globe className="h-3.5 w-3.5" />
              Publish Story
            </>
          )}
        </button>
      )}
    </div>
  );
}
