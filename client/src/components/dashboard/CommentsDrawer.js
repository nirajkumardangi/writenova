"use client";

import { useState, useEffect } from "react";
import { X, Send, MessageCircle, Heart, User } from "lucide-react";
import { useCurrentUser } from "@/features/auth/hooks";

export default function CommentsDrawer({ isOpen, onClose, article, onCommentAdded }) {
  const { user } = useCurrentUser();
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]);

  useEffect(() => {
    if (article?._id) {
      // Retrieve persistent comments from localStorage
      const storageKey = `writenova_comments_${article._id}`;
      const savedComments = localStorage.getItem(storageKey);
      if (savedComments) {
        try {
          setComments(JSON.parse(savedComments));
        } catch (e) {
          setComments(getInitialComments(article._id));
        }
      } else {
        const initial = getInitialComments(article._id);
        setComments(initial);
        localStorage.setItem(storageKey, JSON.stringify(initial));
      }
    }
  }, [article?._id]);

  if (!isOpen || !article) return null;

  const getInitialComments = (id) => {
    return [
      {
        id: "c1",
        author: "Sarah Jenkins",
        username: "sarahj",
        content: "Insightful article! Loved the practical breakdown in section 2.",
        createdAt: "2 hours ago",
        likes: 4,
      },
      {
        id: "c2",
        author: "David Chen",
        username: "davidchen_dev",
        content: "Great writeup! Thanks for sharing this perspective.",
        createdAt: "5 hours ago",
        likes: 2,
      },
    ];
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const newComment = {
      id: `c_${Date.now()}`,
      author: user?.username || "You",
      username: user?.username || "user",
      content: commentText.trim(),
      createdAt: "Just now",
      likes: 0,
    };

    const updated = [newComment, ...comments];
    setComments(updated);
    localStorage.setItem(`writenova_comments_${article._id}`, JSON.stringify(updated));
    setCommentText("");

    if (onCommentAdded) {
      onCommentAdded(article._id, updated.length);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden select-none animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-gray-100 animate-in slide-in-from-right duration-300">
          {/* Drawer Header */}
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-gray-900 stroke-[1.75]" />
              <h3 className="font-serif font-bold text-lg text-gray-900">
                Responses ({comments.length})
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-gray-400 hover:text-black rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Article Info Bar */}
          <div className="px-6 py-3 bg-gray-50/70 border-b border-gray-100">
            <p className="text-xs font-serif font-bold text-gray-800 truncate">
              {article.title || "Untitled Story"}
            </p>
          </div>

          {/* Comment Input */}
          <form onSubmit={handleAddComment} className="p-6 border-b border-gray-100 bg-white">
            <div className="flex gap-3 items-start">
              <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                {(user?.username || "U").charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="What are your thoughts?"
                  rows={3}
                  className="w-full text-xs font-medium p-3 border border-gray-200 rounded-xl focus:outline-none focus:border-black transition-colors resize-none"
                />
                <div className="mt-2 flex justify-end">
                  <button
                    type="submit"
                    disabled={!commentText.trim()}
                    className="px-4 py-1.5 bg-black text-white text-xs font-bold rounded-full hover:bg-neutral-800 disabled:opacity-40 disabled:hover:bg-black transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Send className="h-3 w-3" /> Respond
                  </button>
                </div>
              </div>
            </div>
          </form>

          {/* Comments List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {comments.map((comment) => (
              <div key={comment.id} className="border-b border-gray-100 pb-5 last:border-b-0">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="h-7 w-7 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 font-bold text-xs">
                      {comment.author.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-gray-900 block leading-none">
                        {comment.author}
                      </span>
                      <span className="text-[10px] text-gray-400 font-medium">
                        {comment.createdAt}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-gray-600 leading-relaxed font-sans mt-1">
                  {comment.content}
                </p>

                <div className="mt-2.5 flex items-center gap-4 text-[11px] text-gray-400 font-medium">
                  <button className="flex items-center gap-1 hover:text-red-500 transition-colors cursor-pointer">
                    <Heart className="h-3 w-3" /> {comment.likes}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
