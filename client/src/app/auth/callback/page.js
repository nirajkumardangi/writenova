"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { loginWithGoogle } from "@/features/auth/api";
import { useCurrentUser } from "@/features/auth/hooks";

function CallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useCurrentUser();
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const redirectUri = `${window.location.origin}/auth/callback`;

    if (!code) {
      setError("No authorization code found from Google.");
      return;
    }

    async function handleAuth() {
      try {
        const response = await loginWithGoogle(code, redirectUri);
        if (!active) return;

        if (response.data && response.data.accessToken) {
          login(response.data.user, response.data.accessToken);

          // Decode state or redirect to dashboard
          let targetUrl = "/dashboard";
          if (state) {
            try {
              const decoded = decodeURIComponent(state);
              // Ensure we only redirect to local paths to prevent open redirect vulnerabilities
              if (decoded.startsWith("/") && !decoded.startsWith("//")) {
                targetUrl = decoded;
              }
            } catch (e) {
              console.error("Failed to decode redirect state", e);
            }
          }
          router.push(targetUrl);
        } else {
          setError("Invalid response received from authentication server.");
        }
      } catch (err) {
        if (!active) return;
        console.error("Google login error:", err);
        setError(
          err.response?.data?.message ||
            "Failed to log in with Google. Please try again.",
        );
      }
    }

    handleAuth();

    return () => {
      active = false;
    };
  }, [searchParams, login, router]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 px-4">
        <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl border border-red-100 transition-all duration-300 transform hover:scale-[1.01]">
          <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-50 rounded-full">
            <svg
              className="w-6 h-6 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-center text-slate-900 mb-2">
            Authentication Failed
          </h2>
          <p className="text-sm text-center text-slate-500 mb-6">{error}</p>
          <button
            onClick={() => router.push("/")}
            className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-xl transition-colors duration-200 text-sm shadow-sm"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 px-4">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl border border-slate-100 flex flex-col items-center">
        {/* Sleek animated spinner */}
        <div className="relative w-16 h-16 mb-6">
          <div className="absolute inset-0 rounded-full border-4 border-slate-100"></div>
          <div className="absolute inset-0 rounded-full border-4 border-slate-900 border-t-transparent animate-spin"></div>
        </div>
        <h2 className="text-xl font-semibold text-slate-900 mb-2 animate-pulse">
          Completing Login
        </h2>
        <p className="text-sm text-slate-500 text-center">
          Securing your session and setting up your dashboard...
        </p>
      </div>
    </div>
  );
}

export default function CallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
          <div className="relative w-16 h-16 mb-6">
            <div className="absolute inset-0 rounded-full border-4 border-slate-100"></div>
            <div className="absolute inset-0 rounded-full border-4 border-slate-900 border-t-transparent animate-spin"></div>
          </div>
        </div>
      }
    >
      <CallbackHandler />
    </Suspense>
  );
}
