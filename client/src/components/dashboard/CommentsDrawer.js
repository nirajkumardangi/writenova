"use client";

import { useState, useEffect } from "react";
import { X, Send, MessageCircle, Heart, Loader2, Trash2 } from "lucide-react";
import { useCurrentUser } from "@/features/auth/hooks";
import api from "@/lib/api";

export default function CommentsDrawer({ isOpen = true, onClose, article, onCommentCountChange }) {
  const { user } = useCurrentUser();
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (article?._id) {
      const fetchComments = async () => {
        setLoading(true);
        try {
          const res = await api.get(`/social/comments/${article._id}`);
          if (res.data.success) {
            setComments(res.data.comments || []);
            if (onCommentCountChange) {
              onCommentCountChange(article._id, (res.data.comments || []).length);
            }
          }
        } catch (err) {
          console.error("Failed to fetch comments:", err);
        } finally {
          setLoading(false);
        }
      };
      fetchComments();
    }
  }, [article?._id]);

  if (!isOpen || !article) return null;

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim() || submitting) return;

    setSubmitting(true);
    try {
      const res = await api.post(`/social/comment/${article._id}`, {
        content: commentText.trim(),
      });

      if (res.data.success) {
        const newComments = [res.data.comment, ...comments];
        setComments(newComments);
        setCommentText("");
        if (onCommentCountChange) {
          onCommentCountChange(article._id, newComments.length);
        }
      }
    } catch (err) {
      console.error("Failed to add comment:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const res = await api.delete(`/social/comment/${commentId}`);
      if (res.data.success) {
        const updated = comments.filter((c) => c._id !== commentId);
        setComments(updated);
        if (onCommentCountChange) {
          onCommentCountChange(article._id, updated.length);
        }
      }
    } catch (err) {
      console.error("Failed to delete comment:", err);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "Just now";
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
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
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.username || "You"}
                  className="h-8 w-8 rounded-full object-cover shrink-0 border border-gray-200"
                />
              ) : (
                <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                  {(user?.username || "U").charAt(0).toUpperCase()}
                </div>
              )}
              <div className="flex-1">
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="What are your thoughts?"
                  rows={3}
                  className="w-full text-xs font-medium p-3 border border-gray-200 rounded-xl focus:outline-none focus:border-black transition-colors resize-none text-gray-900 placeholder:text-gray-400"
                />
                <div className="mt-2 flex justify-end">
                  <button
                    type="submit"
                    disabled={!commentText.trim() || submitting}
                    className="px-4 py-1.5 bg-black text-white text-xs font-bold rounded-full hover:bg-neutral-800 disabled:opacity-40 disabled:hover:bg-black transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    {submitting ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <Send className="h-3 w-3" />
                    )}
                    <span>Respond</span>
                  </button>
                </div>
              </div>
            </div>
          </form>

          {/* Comments List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="h-6 w-6 text-gray-400 animate-spin" />
                <span className="mt-2 text-xs text-gray-400">Loading responses...</span>
              </div>
            ) : comments.length > 0 ? (
              comments.map((comment) => {
                const commentUser = comment.user || {};
                const name = commentUser.username || "Anonymous";
                const isMyComment = user && (user._id === commentUser._id || user._id === comment.user);

                return (
                  <div key={comment._id} className="border-b border-gray-100 pb-5 last:border-b-0 group">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {commentUser.avatar ? (
                          <img
                            src={commentUser.avatar}
                            alt={name}
                            className="h-7 w-7 rounded-full object-cover border border-gray-200"
                          />
                        ) : (
                          <div className="h-7 w-7 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-bold text-xs">
                            {name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <span className="text-xs font-bold text-gray-900 block leading-none">
                            {name}
                          </span>
                          <span className="text-[10px] text-gray-400 font-medium">
                            {formatDate(comment.createdAt)}
                          </span>
                        </div>
                      </div>

                      {isMyComment && (
                        <button
                          onClick={() => handleDeleteComment(comment._id)}
                          className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-600 transition-opacity p-1 rounded cursor-pointer"
                          title="Delete response"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>

                    <p className="text-xs text-gray-600 leading-relaxed font-sans mt-1">
                      {comment.content}
                    </p>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-12 bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
                <p className="text-xs text-gray-400 font-medium">No responses yet. Be the first to share your thoughts!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
