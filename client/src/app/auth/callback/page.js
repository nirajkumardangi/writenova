"use client";

import { Suspense, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/features/auth/store";
import api from "@/lib/api";

function CallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const login = useAuthStore((state) => state.login);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const code = searchParams.get("code");
    const state = searchParams.get("state");

    if (!code) {
      router.push("/login");
      return;
    }

    const exchangeCode = async () => {
      try {
        const redirectUri = `${window.location.origin}/auth/callback`;
        const res = await api.post("/auth/google", {
          code,
          redirectUri,
        });

        if (res.data.success) {
          login(res.data.user, res.data.accessToken);
          // Decode state to return to originating page/state, fallback to dashboard
          const targetUrl = state ? decodeURIComponent(state) : "/dashboard";
          router.push(targetUrl);
        } else {
          router.push("/login");
        }
      } catch (error) {
        console.error("OAuth Callback exchange error:", error);
        router.push("/login");
      }
    };

    exchangeCode();
  }, [searchParams, router, login]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#F7F4ED] px-4">
      <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm flex flex-col items-center max-w-sm w-full text-center">
        <div className="w-10 h-10 border-4 border-gray-100 border-t-black rounded-full animate-spin mb-6"></div>
        <h2 className="text-xl font-serif font-bold text-gray-900 mb-2">Completing Sign In</h2>
        <p className="text-gray-500 text-sm">Please wait while we authenticate your account with Google.</p>
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#F7F4ED] px-4">
        <div className="w-10 h-10 border-4 border-gray-100 border-t-black rounded-full animate-spin"></div>
      </div>
    }>
      <CallbackHandler />
    </Suspense>
  );
}
