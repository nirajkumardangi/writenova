"use client";

import Hero from "@/components/ui/hero";
import { useAuth } from "@/context/AuthContext";
import Feed from "@/components/dashboard/Feed";

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) return null;

  if (user) {
    return <Feed />;
  }

  return <Hero />;
}
