"use client";

import { ArrowLeft, FileQuestion, Home } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#F7F4ED] px-6 text-center">
      <div className="max-w-md w-full bg-white border border-neutral-200/60 rounded-3xl p-8 md:p-10 shadow-sm relative overflow-hidden">
        {/* Subtle decorative background gradient blurs */}
        <div className="absolute -top-12 -left-12 w-24 h-24 bg-amber-100/40 rounded-full blur-2xl" />
        <div className="absolute -bottom-12 -right-12 w-24 h-24 bg-neutral-200/40 rounded-full blur-2xl" />

        <div className="flex justify-center mb-6 relative">
          <div className="bg-amber-50 p-4 rounded-2xl text-amber-600 border border-amber-100">
            <FileQuestion className="w-8 h-8 stroke-[1.5]" />
          </div>
        </div>

        {/* Large 404 text with gradient styling */}
        <span className="text-[12px] font-mono font-semibold tracking-widest text-amber-600 uppercase bg-amber-50 px-3 py-1 rounded-full border border-amber-100/50 mb-3 inline-block">
          Error 404
        </span>

        <h1 className="font-serif text-3xl md:text-4xl text-neutral-900 tracking-tight mb-3">
          Page not found
        </h1>

        <p className="text-neutral-500 text-[15px] leading-relaxed mb-8">
          The page you are looking for doesn't exist, has been moved, or is
          temporarily unavailable. Let's get you back on track.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-stretch relative">
          <button
            onClick={() => router.back()}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-white border border-neutral-300 text-neutral-700 rounded-full font-medium hover:bg-neutral-50 hover:text-black transition-all active:scale-95 cursor-pointer shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>

          <Link
            href="/"
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-neutral-900 text-white rounded-full font-medium hover:bg-black transition-all active:scale-95 shadow-md"
          >
            <Home className="w-4 h-4" />
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}
