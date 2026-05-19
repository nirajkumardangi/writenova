"use client";

import GoogleProvider from "@/components/auth/google-provider";
import { useAuthStore } from "@/stores/authStore";
import { useEffect } from "react";

export function AuthProviders({ children }) {
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const loading = useAuthStore((state) => state.loading);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-white">
        <div className="w-8 h-8 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>
      </div>
    );
  }

  return <GoogleProvider>{children}</GoogleProvider>;
}
