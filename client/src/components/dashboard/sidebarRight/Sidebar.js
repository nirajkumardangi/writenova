"use client";

import { useState, useEffect } from "react";
import { X, Plus, Check } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const ALL_TOPICS = [
  "Data Science",
  "Self Improvement",
  "Writing",
  "Relationships",
  "Politics",
  "Cryptocurrency",
  "Productivity",
  "Technology",
  "Design",
  "Software Engineering",
  "Machine Learning",
  "Mental Health",
];

const INITIAL_RECOMMENDED_USERS = [
  {
    id: "nick-babich",
    name: "Nick Babich",
    bio: "Product designer & editor-in-chief of UX Planet",
    initials: "NB",
    bg: "bg-gradient-to-br from-indigo-500 to-purple-600 text-white",
  },
  {
    id: "levelup-coding",
    name: "Level Up Coding",
    bio: "Coding tutorials, tech stories, and developer guides",
    initials: "LC",
    bg: "bg-gradient-to-br from-gray-700 to-black text-white",
  },
  {
    id: "cassie-kozyrkov",
    name: "Cassie Kozyrkov",
    bio: "Chief Decision Scientist, Google. Stats, AI, and poetry.",
    initials: "CK",
    bg: "bg-gradient-to-br from-emerald-400 to-teal-600 text-white",
  },
];

export default function SidebarRight() {
  const pathname = usePathname();
  const isDashboard = pathname === "/dashboard";

  if (!isDashboard) return null;

  const [showPromo, setShowPromo] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const [expandedTopics, setExpandedTopics] = useState(false);
  const [activeTopics, setActiveTopics] = useState([]);
  const [followedUsers, setFollowedUsers] = useState({});

  // Safe client-side check to prevent hydration mismatch
  useEffect(() => {
    setIsMounted(true);
    const isDismissed = localStorage.getItem("writenova_promo_dismissed");
    if (isDismissed === "true") {
      setShowPromo(false);
    }
  }, []);

  const handleDismissPromo = () => {
    setShowPromo(false);
    localStorage.setItem("writenova_promo_dismissed", "true");
  };

  const handleResetPromo = () => {
    setShowPromo(true);
    localStorage.removeItem("writenova_promo_dismissed");
  };

  const toggleTopic = (topic) => {
    if (activeTopics.includes(topic)) {
      setActiveTopics(activeTopics.filter((t) => t !== topic));
    } else {
      setActiveTopics([...activeTopics, topic]);
    }
  };

  const toggleFollow = (userId) => {
    setFollowedUsers((prev) => ({
      ...prev,
      [userId]: !prev[userId],
    }));
  };

  // Determine which topics to show (7 initial, or all if expanded)
  const visibleTopics = expandedTopics ? ALL_TOPICS : ALL_TOPICS.slice(0, 7);

  if (!isMounted) {
    // Avoid mismatch during SSR hydration by rendering empty placeholder
    return (
      <div className="w-[368px] flex-shrink-0 animate-pulse space-y-8 p-8">
        <div className="h-48 bg-gray-100 rounded-2xl"></div>
        <div className="space-y-3">
          <div className="h-6 w-32 bg-gray-100 rounded"></div>
          <div className="h-24 bg-gray-100 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <aside className="hidden no-scrollbar md:block w-full md:w-[260px] lg:w-[320px] xl:w-[368px] flex-shrink-0 border-l border-gray-100 pl-6 lg:pl-8 pr-6 lg:pr-8 py-8 overflow-y-auto">
      <div className="sticky top-4 flex flex-col gap-8 select-none">
        {/* ── Writing on Medium Promo Card ── */}
        {showPromo ? (
          <div className="relative overflow-hidden rounded-2xl bg-blue-50/70 border border-blue-100/50 p-6 transition-all duration-300 hover:shadow-md">
            {/* Close Button */}
            <button
              onClick={handleDismissPromo}
              className="absolute top-4 right-4 text-blue-400 hover:text-blue-900 transition-colors p-1 rounded-full hover:bg-blue-100/50"
              aria-label="Dismiss banner"
            >
              <X className="h-4 w-4" />
            </button>

            <h3 className="font-serif text-lg font-bold text-blue-950 mb-4">
              Writing on WriteNova
            </h3>

            <ul className="space-y-3 mb-5 text-sm text-blue-900 font-medium">
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5 select-none">•</span>
                <span>Join our WriteNova Writing 101 Webinar</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5 select-none">•</span>
                <span>Read WriteNova tips & tricks</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5 select-none">•</span>
                <span>Get practical writing advice</span>
              </li>
            </ul>

            <Link
              href="/new-story"
              className="inline-block px-5 py-2 bg-black text-white hover:bg-neutral-800 active:scale-95 text-sm font-semibold rounded-full shadow-sm transition-all"
            >
              Start writing
            </Link>
          </div>
        ) : (
          <div className="flex justify-end">
            <button
              onClick={handleResetPromo}
              className="text-[11px] text-gray-400 hover:text-gray-600 underline transition-colors cursor-pointer"
            >
              Show writing tip banner
            </button>
          </div>
        )}

        {/* ── Recommended Topics ── */}
        <div className="flex flex-col gap-3">
          <h3 className="text-[16px] font-bold text-gray-900 font-sans">
            Recommended topics
          </h3>

          <div className="flex flex-wrap gap-2 transition-all duration-300">
            {visibleTopics.map((topic) => {
              const isActive = activeTopics.includes(topic);
              return (
                <button
                  key={topic}
                  onClick={() => toggleTopic(topic)}
                  className={`text-[13px] px-4 py-2 rounded-full font-medium transition-all cursor-pointer ${
                    isActive
                      ? "bg-black text-white hover:bg-neutral-800"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {topic}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setExpandedTopics(!expandedTopics)}
            className="text-sm font-medium text-gray-500 hover:text-black transition-colors self-start mt-1 cursor-pointer"
          >
            {expandedTopics ? "See fewer topics" : "See more topics"}
          </button>
        </div>

        {/* ── Who to Follow ── */}
        <div className="flex flex-col gap-4">
          <h3 className="text-[16px] font-bold text-gray-900 font-sans">
            Who to follow
          </h3>

          <div className="flex flex-col gap-4">
            {INITIAL_RECOMMENDED_USERS.map((user) => {
              const isFollowed = !!followedUsers[user.id];
              return (
                <div
                  key={user.id}
                  className="flex items-start justify-between gap-3 group"
                >
                  {/* User Info Column */}
                  <div className="flex gap-3">
                    {/* Avatar */}
                    <div
                      className={`h-[40px] w-[40px] rounded-full flex-shrink-0 flex items-center justify-center font-bold text-[14px] shadow-sm tracking-wide ${user.bg} group-hover:scale-105 transition-transform duration-200`}
                    >
                      {user.initials}
                    </div>

                    {/* Text details */}
                    <div className="flex flex-col">
                      <span className="text-[14px] font-bold text-gray-950 hover:underline cursor-pointer">
                        {user.name}
                      </span>
                      <p className="text-[12px] text-gray-500 leading-[1.3] mt-0.5 line-clamp-2 max-w-[200px]">
                        {user.bio}
                      </p>
                    </div>
                  </div>

                  {/* Follow Button */}
                  <button
                    onClick={() => toggleFollow(user.id)}
                    className={`text-[13px] font-medium px-4 py-1.5 rounded-full transition-all border shrink-0 cursor-pointer ${
                      isFollowed
                        ? "bg-transparent text-gray-500 border-gray-300 hover:border-red-500 hover:text-red-500 hover:after:content-['Unfollow'] after:content-['Following'] hover:bg-red-50/20"
                        : "bg-transparent text-black border-neutral-600 hover:border-black"
                    }`}
                    style={{ minWidth: "90px", textAlign: "center" }}
                  >
                    {!isFollowed && "Follow"}
                  </button>
                </div>
              );
            })}
          </div>

          <button className="text-sm font-medium text-gray-500 hover:text-black transition-colors self-start mt-1 cursor-pointer">
            See more suggestions
          </button>
        </div>
      </div>
    </aside>
  );
}
