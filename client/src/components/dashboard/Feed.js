"use client";

import { useState } from "react";
import { Bookmark, Heart, MessageCircle, MoreHorizontal } from "lucide-react";

const MOCK_FEED_DATA = {
  "for-you": [
    {
      id: "fy-1",
      author: "Cassie Kozyrkov",
      initials: "CK",
      authorBg: "bg-gradient-to-br from-emerald-400 to-teal-600 text-white",
      title: "The Future of Decision Intelligence in AI",
      excerpt:
        "Designers are often judged by their deliverables, but the habits behind their work are what truly define their success in the era of artificial intelligence...",
      date: "May 18, 2026",
      readTime: "6 min read",
      topic: "Data Science",
      likesCount: 324,
      commentsCount: 22,
    },
    {
      id: "fy-2",
      author: "Nick Babich",
      initials: "NB",
      authorBg: "bg-gradient-to-br from-indigo-500 to-purple-600 text-white",
      title: "10 Essential Design Habits for Product Designers",
      excerpt:
        "A deep dive into the behaviors that differentiate world-class product designers from mediocre ones, featuring actionable steps you can start practicing today...",
      date: "May 15, 2026",
      readTime: "5 min read",
      topic: "Design",
      likesCount: 185,
      commentsCount: 14,
    },
    {
      id: "fy-3",
      author: "Sarah Jenkins",
      initials: "SJ",
      authorBg: "bg-gradient-to-br from-pink-400 to-rose-500 text-white",
      title: "Navigating the Shift to Hybrid Workspace Ecosystems",
      excerpt:
        "As remote work evolves, organizations are restructuring physical and digital workspaces. Here is what we learned from analyzing 500 tech companies...",
      date: "May 12, 2026",
      readTime: "7 min read",
      topic: "Productivity",
      likesCount: 96,
      commentsCount: 8,
    },
  ],
  following: [
    {
      id: "fol-1",
      author: "Level Up Coding",
      initials: "LC",
      authorBg: "bg-gradient-to-br from-gray-700 to-black text-white",
      title: "Getting Started with Next.js 16 and Tailwind CSS v4",
      excerpt:
        "Tailwind CSS v4.0 is finally here with massive compile-time performance increases and CSS-first configuration. Let's learn how to upgrade our Next.js projects...",
      date: "May 20, 2026",
      readTime: "8 min read",
      topic: "Software Engineering",
      likesCount: 512,
      commentsCount: 45,
    },
    {
      id: "fol-2",
      author: "Cassie Kozyrkov",
      initials: "CK",
      authorBg: "bg-gradient-to-br from-emerald-400 to-teal-600 text-white",
      title: "Why I Stopped Using Redux in 2026",
      excerpt:
        "With standard React state, Context API, and modern libraries like Zustand taking over, Redux has become an unnecessary boilerplate. Here is our transition report...",
      date: "May 14, 2026",
      readTime: "4 min read",
      topic: "Technology",
      likesCount: 210,
      commentsCount: 19,
    },
  ],
  featured: [
    {
      id: "feat-1",
      author: "Nick Babich",
      initials: "NB",
      authorBg: "bg-gradient-to-br from-indigo-500 to-purple-600 text-white",
      title: "Unlocking Creativity: The Science of Productive Boredom",
      excerpt:
        "In a world full of notifications and micro-stimuli, our brains rarely get downtime. Neuroscience shows that structured boredom is the key to original thinking...",
      date: "May 19, 2026",
      readTime: "7 min read",
      topic: "Mental Health",
      likesCount: 440,
      commentsCount: 31,
    },
    {
      id: "feat-2",
      author: "Alex Rivera",
      initials: "AR",
      authorBg: "bg-gradient-to-br from-blue-400 to-indigo-600 text-white",
      title: "Is Bitcoin Ready for the Next Major Global Halving?",
      excerpt:
        "Analyzing macro trends, liquidity rates, and blockchain transaction data to evaluate what the upcoming Bitcoin halving cycle means for the crypto economy...",
      date: "May 11, 2026",
      readTime: "9 min read",
      topic: "Cryptocurrency",
      likesCount: 620,
      commentsCount: 58,
    },
  ],
};

export default function Feed() {
  const [activeTab, setActiveTab] = useState("for-you");
  const [bookmarks, setBookmarks] = useState({});
  const [likes, setLikes] = useState({});

  const toggleBookmark = (id) => {
    setBookmarks((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const toggleLike = (id) => {
    setLikes((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const activeStories = MOCK_FEED_DATA[activeTab] || [];

  return (
    <div className="mx-auto max-w-3xl py-8 px-4 sm:px-6">
      {/* Navigation Tabs */}
      <div className="border-b border-gray-100 mb-8 sticky top-0 bg-white z-10">
        <nav className="-mb-px flex gap-8 ">
          {["for-you", "following", "featured"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`whitespace-nowrap border-b-2 py-4 px-1 text-[14px] sm:text-[15px] font-semibold transition-colors cursor-pointer capitalize ${
                activeTab === tab
                  ? "border-black text-black"
                  : "border-transparent text-gray-400 hover:border-gray-300 hover:text-gray-700"
              }`}
            >
              {tab.replace("-", " ")}
            </button>
          ))}
        </nav>
      </div>

      {/* Stories list */}
      <div className="flex flex-col gap-10">
        {activeStories.length > 0 ? (
          activeStories.map((story) => {
            const isBookmarked = !!bookmarks[story.id];
            const isLiked = !!likes[story.id];
            const displayLikes = story.likesCount + (isLiked ? 1 : 0);

            return (
              <article
                key={story.id}
                className="flex flex-col gap-3 pb-8 border-b border-gray-100/70 last:border-b-0 group"
              >
                {/* Author line */}
                <div className="flex items-center gap-2">
                  <div
                    className={`h-6 w-6 rounded-full flex items-center justify-center font-bold text-[9px] ${story.authorBg}`}
                  >
                    {story.initials}
                  </div>
                  <span className="text-xs font-semibold text-gray-900">
                    {story.author}
                  </span>
                  <span className="text-xs text-gray-400 select-none">•</span>
                  <span className="text-xs text-gray-500">{story.date}</span>
                </div>

                {/* Title & Excerpt */}
                <div className="flex flex-col gap-1">
                  <h2 className="text-xl sm:text-2xl font-serif font-bold text-gray-900 group-hover:text-neutral-800 transition-colors leading-tight">
                    {story.title}
                  </h2>
                  <p className="text-sm sm:text-[15px] text-gray-500 line-clamp-3 leading-relaxed mt-1">
                    {story.excerpt}
                  </p>
                </div>

                {/* Footer of the article */}
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-3 sm:gap-5">
                    <span className="text-xs font-medium bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">
                      {story.topic}
                    </span>
                    <span className="text-xs text-gray-400">
                      {story.readTime}
                    </span>

                    {/* Likes (Heart Button) */}
                    <button
                      onClick={() => toggleLike(story.id)}
                      className={`flex items-center gap-1.5 text-xs transition-colors cursor-pointer select-none ${
                        isLiked
                          ? "text-rose-600 font-semibold"
                          : "text-gray-400 hover:text-black"
                      }`}
                      aria-label={isLiked ? "Unlike story" : "Like story"}
                    >
                      <Heart
                        className={`h-4 w-4 transition-transform duration-200 ${
                          isLiked ? "fill-rose-500 text-rose-500 scale-110" : ""
                        }`}
                      />
                      <span>{displayLikes}</span>
                    </button>

                    {/* Comments (Message Circle) */}
                    <button
                      className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-black transition-colors cursor-pointer select-none"
                      aria-label={`${story.commentsCount} comments`}
                    >
                      <MessageCircle className="h-4 w-4" />
                      <span>{story.commentsCount}</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Bookmark Button */}
                    <button
                      onClick={() => toggleBookmark(story.id)}
                      className={`p-1.5 rounded-full hover:bg-gray-100 transition-colors cursor-pointer ${
                        isBookmarked
                          ? "text-amber-500"
                          : "text-gray-400 hover:text-black"
                      }`}
                      aria-label={
                        isBookmarked ? "Remove bookmark" : "Bookmark article"
                      }
                    >
                      <Bookmark
                        className="h-[18px] w-[18px]"
                        fill={isBookmarked ? "currentColor" : "none"}
                      />
                    </button>

                    {/* Options Button */}
                    <button
                      className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-black transition-colors cursor-pointer"
                      aria-label="More options"
                    >
                      <MoreHorizontal className="h-[18px] w-[18px]" />
                    </button>
                  </div>
                </div>
              </article>
            );
          })
        ) : (
          <div className="text-gray-500 text-center py-20">
            Your feed is currently empty.
          </div>
        )}
      </div>
    </div>
  );
}
