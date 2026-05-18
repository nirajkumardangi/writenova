"use client";

import GoogleProvider from "@/components/auth/google-provider";
import { useAuthStore } from "@/stores/authStore";
import { useEffect } from "react";

export function AuthProviders({ children }) {
  const checkAuth = useAuthStore((state) => state.checkAuth);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return <GoogleProvider>{children}</GoogleProvider>;
}
