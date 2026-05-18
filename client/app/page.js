"use client";

import Hero from "@/components/ui/hero";
import { useAuthStore } from "@/stores/authStore";
import Feed from "@/components/dashboard/Feed";

export default function Home() {
  const user = useAuthStore((state) => state.user);
  const loading = useAuthStore((state) => state.loading);

  if (loading) return null;

  if (user) {
    return <Feed />;
  }

  return <Hero />;
}
