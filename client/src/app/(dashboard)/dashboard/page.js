"use client";

import { useSearchParams, useRouter } from "next/navigation";
import Feed from "@/components/dashboard/Feed";

export default function DashboardPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const selectedTopic = searchParams?.get("topic") || "";

  const handleClearTopic = () => {
    router.push("/dashboard");
  };

  return <Feed selectedTopic={selectedTopic} onClearTopic={handleClearTopic} />;
}
