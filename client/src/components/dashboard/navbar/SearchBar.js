"use client";

import { Search } from "lucide-react";
import { useState } from "react";

export default function SearchBar() {
  const [query, setQuery] = useState("");

  return (
    <div className="hidden sm:flex items-center rounded-full bg-gray-50 px-4 py-2 w-[240px] md:w-[320px] focus-within:bg-white focus-within:shadow-sm focus-within:border focus-within:border-gray-200 transition-all">
      <Search className="h-4 w-4 text-gray-500 mr-2 flex-shrink-0" />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search"
        className="w-full bg-transparent text-[14px] text-gray-900 outline-none placeholder:text-gray-500"
      />
    </div>
  );
}
