"use client";

import { Search, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQ = searchParams?.get("q") || "";
  const [query, setQuery] = useState(initialQ);

  useEffect(() => {
    setQuery(searchParams?.get("q") || "");
  }, [searchParams]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/dashboard?q=${encodeURIComponent(query.trim())}`);
    } else {
      router.push("/dashboard");
    }
  };

  const clearSearch = () => {
    setQuery("");
    router.push("/dashboard");
  };

  return (
    <form onSubmit={handleSearch} className="hidden sm:flex items-center rounded-full bg-gray-50 px-4 py-2 w-[240px] md:w-[320px] focus-within:bg-white focus-within:shadow-sm focus-within:border focus-within:border-gray-200 transition-all">
      <Search className="h-4 w-4 text-gray-500 mr-2 flex-shrink-0" />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search stories, topics, titles..."
        className="w-full bg-transparent text-[14px] text-gray-900 outline-none placeholder:text-gray-500"
      />
      {query && (
        <button type="button" onClick={clearSearch} className="text-gray-400 hover:text-black p-0.5">
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </form>
  );
}
