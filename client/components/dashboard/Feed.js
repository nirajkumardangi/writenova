"use client";

import { useState } from "react";

export default function Feed() {
  const [activeTab, setActiveTab] = useState("for-you");

  return (
    <div className="mx-auto max-w-3xl py-8 px-4 sm:px-6">
      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex gap-8">
          <button
            onClick={() => setActiveTab("for-you")}
            className={`whitespace-nowrap border-b-2 py-4 px-1 text-[14px] sm:text-[15px] font-medium transition-colors ${
              activeTab === "for-you"
                ? "border-black text-black"
                : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
            }`}
          >
            For you
          </button>
          <button
            onClick={() => setActiveTab("following")}
            className={`whitespace-nowrap border-b-2 py-4 px-1 text-[14px] sm:text-[15px] font-medium transition-colors ${
              activeTab === "following"
                ? "border-black text-black"
                : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
            }`}
          >
            Following
          </button>
          <button
            onClick={() => setActiveTab("featured")}
            className={`whitespace-nowrap border-b-2 py-4 px-1 text-[14px] sm:text-[15px] font-medium transition-colors ${
              activeTab === "featured"
                ? "border-black text-black"
                : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
            }`}
          >
            Featured
          </button>
        </nav>
      </div>

      <div className="flex flex-col gap-10">
        {/* Placeholder for feed content */}
        <div className="text-gray-500 text-center py-20">
          Your feed is currently empty.
        </div>
      </div>
    </div>
  );
}
