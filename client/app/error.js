"use client";

import { useEffect } from "react";
import { AlertCircle, RotateCcw, Home } from "lucide-react";
import Link from "next/link";

export default function ErrorBoundary({ error, reset }) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application runtime error caught:", error);
  }, [error]);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#F7F4ED] px-6 text-center">
      <div className="max-w-md w-full bg-white border border-neutral-200/60 rounded-3xl p-8 md:p-10 shadow-sm relative overflow-hidden">
        {/* Subtle decorative background gradient blur */}
        <div className="absolute -top-12 -left-12 w-24 h-24 bg-red-100/40 rounded-full blur-2xl" />
        <div className="absolute -bottom-12 -right-12 w-24 h-24 bg-neutral-200/40 rounded-full blur-2xl" />

        <div className="flex justify-center mb-6 relative">
          <div className="bg-red-50 p-4 rounded-2xl text-red-500 border border-red-100">
            <AlertCircle className="w-8 h-8 stroke-[1.5]" />
          </div>
        </div>

        <h1 className="font-serif text-3xl md:text-4xl text-neutral-900 tracking-tight mb-3">
          Something went wrong
        </h1>
        
        <p className="text-neutral-500 text-[15px] leading-relaxed mb-8">
          We encountered an unexpected error. Please try refreshing the action or return home.
        </p>

        {error?.digest && (
          <div className="mb-8 p-3 rounded-lg bg-neutral-50 border border-neutral-100 text-left">
            <p className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider mb-1">
              Error Digest
            </p>
            <p className="text-xs font-mono text-neutral-600 break-all">
              {error.digest}
            </p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-stretch relative">
          <button
            onClick={() => reset()}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-neutral-900 text-white rounded-full font-medium hover:bg-black transition-all active:scale-95 cursor-pointer shadow-md"
          >
            <RotateCcw className="w-4 h-4" />
            Try again
          </button>
          
          <Link
            href="/"
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-white border border-neutral-300 text-neutral-700 rounded-full font-medium hover:bg-neutral-50 hover:text-black transition-all active:scale-95"
          >
            <Home className="w-4 h-4" />
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}
