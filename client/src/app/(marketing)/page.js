"use client";

import Hero from "@/components/ui/hero";
import { useAuthStore } from "@/features/auth/store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LandingPage() {
  const user = useAuthStore((state) => state.user);
  const loading = useAuthStore((state) => state.loading);
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.replace("/dashboard");
    }
  }, [user, loading, router]);

  if (loading || user) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[#F7F4ED]">
        <div className="w-8 h-8 border-4 border-gray-200 border-t-black rounded-full animate-spin"></div>
      </div>
    );
  }

  return <Hero />;
}
