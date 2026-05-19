import { Bookmark } from "lucide-react";

export default function LibraryPage() {
  return (
    <div className="mx-auto max-w-3xl py-8 px-4 sm:px-6">
      <div className="border-b border-gray-200 pb-5 mb-8">
        <h1 className="text-3xl font-serif font-bold text-gray-900 flex items-center gap-3">
          <Bookmark className="h-8 w-8 stroke-[1.5]" />
          Your Library
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Manage your saved stories, reading list, and highlights.
        </p>
      </div>

      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="rounded-full bg-gray-50 p-4 mb-4">
          <Bookmark className="h-8 w-8 text-gray-400 stroke-[1.5]" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-1">Your library is empty</h3>
        <p className="text-sm text-gray-500 max-w-md">
          Start saving stories to read them later or keep track of your favorites.
        </p>
      </div>
    </div>
  );
}
