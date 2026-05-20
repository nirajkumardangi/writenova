"use client";

import { useUIStore } from "@/store/uiStore";
import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

const prompts = [
  "Write a blog about 10 best AI tools for coding...",
  "Generate a high-converting startup pitch deck...",
  "Create a viral Twitter thread about Web3...",
  "Draft a professional email for a product launch...",
];

export default function Hero() {
  const openAuthModal = useUIStore((state) => state.openAuthModal);
  const [text, setText] = useState("");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    let i = 0;
    const current = prompts[index];
    const typing = setInterval(() => {
      setText(current.slice(0, i));
      i++;
      if (i > current.length) {
        clearInterval(typing);
        setTimeout(() => {
          setIndex((prev) => (prev + 1) % prompts.length);
        }, 2500);
      }
    }, 50);
    return () => clearInterval(typing);
  }, [index]);

  return (
    <div className="w-full h-full max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-5 items-center relative">
      {/* LEFT CONTENT - Spans full width on mobile, 3 columns on desktop */}
      <div className="col-span-1 lg:col-span-3 flex flex-col space-y-6 z-10 py-10 lg:py-0">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/50 border border-neutral-300 mb-6">
            <Sparkles className="w-3.5 h-3.5 text-neutral-600" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500">
              Next-Gen AI Writing
            </span>
          </div>

          <h1 className="text-[48px] sm:text-[60px] md:text-[75px] lg:text-[85px] font-serif tracking-tight text-neutral-900 leading-[1.05]">
            Design your stories <br />
            <span className="text-neutral-500 italic">with intelligence.</span>
          </h1>

          <p className="mt-4 text-lg lg:text-xl text-neutral-600 max-w-lg leading-relaxed font-light">
            The professional AI engine for creators who demand precision,
            personality, and speed in every word.
          </p>
        </div>

        {/* INPUT SIMULATION CARD */}
        <div className="bg-white/80 backdrop-blur-md border border-neutral-300 rounded-2xl p-5 shadow-sm max-w-sm">
          <div className="min-h-6">
            <p className="text-sm font-medium text-neutral-800 leading-relaxed">
              {text}
              <span className="inline-block w-[1.5px] h-4 bg-black ml-1 animate-pulse" />
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <button
            onClick={() => openAuthModal("signup")}
            className="w-full sm:w-auto px-10 py-4 bg-neutral-900 text-white rounded-full font-medium hover:bg-black transition-all shadow-lg active:scale-95 cursor-pointer"
          >
            Start Writing Free
          </button>
          <button className="group flex items-center gap-2 text-sm font-semibold text-neutral-600 hover:text-black transition-colors pl-2 sm:pl-0 cursor-pointer">
            View Showcase
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* RIGHT CONTENT - Completely hidden on mobile, visible from 'lg' breakpoint up */}
      <div className="hidden lg:flex lg:col-span-2 relative h-full items-center justify-end">
        <div className="relative w-full h-full">
          <Image
            src="/hero-image.png"
            alt="AI Workspace"
            fill
            sizes="(max-width: 768px) 100vw"
            className="object-contain object-right transform scale-150 translate-x-16 select-none"
            priority
          />
          {/* Float Card */}
          <div className="absolute bottom-[15%] right-0 bg-white border border-neutral-200 p-4 rounded-2xl shadow-xl z-20 flex items-center gap-3">
            <div className="bg-emerald-100 p-2 rounded-full text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-neutral-800 uppercase tracking-tight">
                Post Optimized
              </p>
              <p className="text-[10px] text-neutral-500">SEO Score: 98/100</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
