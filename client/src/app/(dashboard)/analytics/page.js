import { BarChart2 } from "lucide-react";

export default function StatsPage() {
  return (
    <div className="mx-auto max-w-3xl py-8 px-4 sm:px-6">
      <div className="border-b border-gray-200 pb-5 mb-8">
        <h1 className="text-3xl font-serif font-bold text-gray-900 flex items-center gap-3">
          <BarChart2 className="h-8 w-8 stroke-[1.5]" />
          Stats
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Track views, reads, and engagement metrics for your stories.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <p className="text-sm font-medium text-gray-500 mb-1">Total Views</p>
          <p className="text-3xl font-bold text-gray-900">0</p>
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <p className="text-sm font-medium text-gray-500 mb-1">Total Reads</p>
          <p className="text-3xl font-bold text-gray-900">0</p>
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <p className="text-sm font-medium text-gray-500 mb-1">
            Followers Gained
          </p>
          <p className="text-3xl font-bold text-gray-900">0</p>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="rounded-full bg-gray-50 p-4 mb-4">
          <BarChart2 className="h-8 w-8 text-gray-400 stroke-[1.5]" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-1">
          No metrics available
        </h3>
        <p className="text-sm text-gray-500 max-w-md">
          Once you publish stories, you'll see views, reads, and overall writer
          metrics here.
        </p>
      </div>
    </div>
  );
}
