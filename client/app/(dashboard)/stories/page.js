import { FileText, Plus } from "lucide-react";
import Link from "next/link";

export default function StoriesPage() {
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
          href="/"
          className="flex items-center gap-2 px-5 py-2.5 bg-black text-white rounded-full text-sm font-medium hover:bg-black/90 active:scale-95 transition-all shadow-sm"
        >
          <Plus className="h-4 w-4" />
          New Story
        </Link>
      </div>

      <div className="flex flex-col gap-8">
        <div className="flex gap-6 border-b border-gray-100 pb-2">
          <button className="text-sm font-semibold border-b-2 border-black pb-2 px-1">
            Drafts (0)
          </button>
          <button className="text-sm font-medium text-gray-500 hover:text-black pb-2 px-1 transition-colors">
            Published (0)
          </button>
        </div>

        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="rounded-full bg-gray-50 p-4 mb-4">
            <FileText className="h-8 w-8 text-gray-400 stroke-[1.5]" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">No drafts yet</h3>
          <p className="text-sm text-gray-500 max-w-md">
            Click "New Story" to start writing your first story on WriteNova.
          </p>
        </div>
      </div>
    </div>
  );
}
