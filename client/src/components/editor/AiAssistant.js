"use client";

import { Sparkles, Loader2 } from "lucide-react";

export default function AiAssistant({
  topic,
  setTopic,
  tone,
  setTone,
  length,
  setLength,
  category,
  setCategory,
  generating,
  onGenerate,
}) {
  return (
    <div className="lg:col-span-4 bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex flex-col gap-4 sticky top-[75px]">
      <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
        <div className="p-1.5 bg-indigo-50 rounded-lg text-indigo-600">
          <Sparkles className="h-5 w-5" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 text-sm">AI Assistant</h3>
          <p className="text-xs text-gray-500">Generate articles with Gemini 3.5 Flash</p>
        </div>
      </div>

      <form onSubmit={onGenerate} className="flex flex-col gap-4">
        {/* Topic input */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-700">What do you want to write about?</label>
          <textarea
            required
            rows={3}
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. Next.js 16 app router performance tips, or 10 morning routine habits..."
            className="w-full text-sm border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-black focus:border-black resize-none"
            disabled={generating}
          />
        </div>

        {/* Tone dropdown */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-700">Tone of Voice</label>
          <select
            value={tone}
            onChange={(e) => setTone(e.target.value)}
            className="w-full text-sm border border-gray-200 rounded-xl p-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-black focus:border-black cursor-pointer"
            disabled={generating}
          >
            <option>Informative and engaging</option>
            <option>Professional and authoritative</option>
            <option>Conversational and human</option>
            <option>Academic and technical</option>
            <option>Creative and narrative</option>
            <option>Bold and persuasive</option>
          </select>
        </div>

        {/* Length dropdown */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-700">Target Length</label>
          <select
            value={length}
            onChange={(e) => setLength(e.target.value)}
            className="w-full text-sm border border-gray-200 rounded-xl p-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-black focus:border-black cursor-pointer"
            disabled={generating}
          >
            <option>Short (300-500 words)</option>
            <option>Medium (500-700 words)</option>
            <option>Long (800-1200 words)</option>
          </select>
        </div>

        {/* Category dropdown */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-700">Category/Niche</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full text-sm border border-gray-200 rounded-xl p-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-black focus:border-black cursor-pointer"
            disabled={generating}
          >
            <option>Technology</option>
            <option>Business</option>
            <option>Lifestyle</option>
            <option>Health & Wellness</option>
            <option>Finance</option>
            <option>Education</option>
            <option>General</option>
          </select>
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={generating || !topic.trim()}
          className="w-full py-3 px-4 bg-black text-white hover:bg-neutral-800 disabled:bg-neutral-200 disabled:text-neutral-500 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed shadow-sm select-none"
        >
          {generating ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Generating article...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4 fill-white" />
              Generate Article
            </>
          )}
        </button>
      </form>
    </div>
  );
}
