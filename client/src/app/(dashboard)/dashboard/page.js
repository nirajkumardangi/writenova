"use client";

import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import Feed from "@/components/dashboard/Feed";

function DashboardContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const selectedTopic = searchParams?.get("topic") || "";
  const searchQuery = searchParams?.get("q") || "";

  const handleClearTopic = () => {
    router.push("/dashboard");
  };

  return (
    <Feed
      selectedTopic={selectedTopic}
      searchQuery={searchQuery}
      onClearTopic={handleClearTopic}
    />
  );
}

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="h-8 w-8 text-black animate-spin stroke-[1.5]" />
          <span className="mt-3 text-sm text-gray-500 font-medium">Loading feed...</span>
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}
