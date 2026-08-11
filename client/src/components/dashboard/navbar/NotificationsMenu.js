"use client";

import { useState, useRef, useEffect } from "react";
import { Bell, Heart, MessageCircle, UserPlus, Sparkles, CheckCheck, X, Loader2 } from "lucide-react";
import Link from "next/link";
import api from "@/lib/api";

export default function NotificationsMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("all");
  const menuRef = useRef(null);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await api.get("/notifications");
      if (res.data.success) {
        setNotifications(res.data.notifications || []);
        setUnreadCount(res.data.unreadCount || 0);
      }
    } catch (err) {
      console.warn("Failed to fetch notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();

    // Poll for new notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAllAsRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
    try {
      await api.put("/notifications/read-all");
    } catch (err) {
      console.error("Failed to mark all as read:", err);
    }
  };

  const markAsRead = async (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n._id === id ? { ...n, read: true } : n))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
    try {
      await api.put(`/notifications/${id}/read`);
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
    }
  };

  const clearNotification = async (id, e) => {
    e.stopPropagation();
    const target = notifications.find((n) => n._id === id);
    setNotifications((prev) => prev.filter((n) => n._id !== id));
    if (target && !target.read) {
      setUnreadCount((prev) => Math.max(0, prev - 1));
    }

    try {
      await api.delete(`/notifications/${id}`);
    } catch (err) {
      console.error("Failed to delete notification:", err);
    }
  };

  const filteredNotifications = filter === "unread"
    ? notifications.filter((n) => !n.read)
    : notifications;

  const getIcon = (type) => {
    switch (type) {
      case "like":
        return <Heart className="h-3.5 w-3.5 text-rose-500 fill-rose-500" />;
      case "comment":
        return <MessageCircle className="h-3.5 w-3.5 text-blue-500" />;
      case "follow":
        return <UserPlus className="h-3.5 w-3.5 text-emerald-500" />;
      default:
        return <Sparkles className="h-3.5 w-3.5 text-indigo-500" />;
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  return (
    <div className="relative" ref={menuRef}>
      {/* Bell Button */}
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) fetchNotifications();
        }}
        className="relative text-gray-500 hover:text-black transition-colors p-1.5 rounded-full hover:bg-gray-100 cursor-pointer select-none"
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5 stroke-[1.5]" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-600 text-[10px] font-bold text-white shadow-xs animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Notifications Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 sm:w-96 rounded-3xl bg-white shadow-2xl border border-gray-100 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          {/* Panel Header */}
          <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between bg-white">
            <div className="flex items-center gap-2">
              <h3 className="font-serif font-bold text-lg text-gray-900">Notifications</h3>
              {unreadCount > 0 && (
                <span className="bg-rose-100 text-rose-700 text-xs px-2 py-0.5 rounded-full font-bold">
                  {unreadCount} new
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs font-semibold text-gray-500 hover:text-black flex items-center gap-1 cursor-pointer transition-colors"
              >
                <CheckCheck className="h-3.5 w-3.5 text-emerald-600" />
                Mark read
              </button>
            )}
          </div>

          {/* Filter Tabs */}
          <div className="flex border-b border-gray-100 bg-gray-50/50 px-4 py-2 text-xs font-semibold">
            <button
              onClick={() => setFilter("all")}
              className={`px-3 py-1 rounded-full cursor-pointer transition-all ${
                filter === "all" ? "bg-white text-black shadow-xs font-bold" : "text-gray-500 hover:text-black"
              }`}
            >
              All ({notifications.length})
            </button>
            <button
              onClick={() => setFilter("unread")}
              className={`px-3 py-1 rounded-full cursor-pointer transition-all ${
                filter === "unread" ? "bg-white text-black shadow-xs font-bold" : "text-gray-500 hover:text-black"
              }`}
            >
              Unread ({unreadCount})
            </button>
          </div>

          {/* List */}
          <div className="max-h-[380px] overflow-y-auto divide-y divide-gray-50">
            {loading && notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="h-6 w-6 text-gray-400 animate-spin" />
                <span className="mt-2 text-xs text-gray-400">Loading notifications...</span>
              </div>
            ) : filteredNotifications.length > 0 ? (
              filteredNotifications.map((n) => {
                const senderName = n.sender?.username || "Someone";
                const senderAvatar = n.sender?.avatar;

                return (
                  <div
                    key={n._id}
                    onClick={() => {
                      markAsRead(n._id);
                      setIsOpen(false);
                    }}
                    className={`p-4 flex items-start gap-3 hover:bg-gray-50/80 transition-colors cursor-pointer group relative ${
                      !n.read ? "bg-blue-50/30" : ""
                    }`}
                  >
                    {/* Avatar / Icon */}
                    <div className="relative shrink-0">
                      {senderAvatar ? (
                        <img src={senderAvatar} alt={senderName} className="h-9 w-9 rounded-full object-cover border border-gray-200" />
                      ) : (
                        <div className="h-9 w-9 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
                          {senderName.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <span className="absolute -bottom-1 -right-1 bg-white p-0.5 rounded-full shadow-xs">
                        {getIcon(n.type)}
                      </span>
                    </div>

                    {/* Text */}
                    <div className="flex-1 min-w-0 pr-4">
                      <p className="text-xs text-gray-800 leading-snug">
                        <strong className="font-bold text-gray-900">{senderName}</strong> {n.message}
                      </p>
                      <span className="text-[10px] text-gray-400 font-medium mt-1 block">{formatDate(n.createdAt)}</span>
                    </div>

                    {/* Unread indicator dot & dismiss */}
                    <div className="flex items-center gap-1 shrink-0">
                      {!n.read && <span className="h-2 w-2 rounded-full bg-rose-600"></span>}
                      <button
                        onClick={(e) => clearNotification(n._id, e)}
                        className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-gray-600 p-1 rounded transition-opacity cursor-pointer"
                        title="Dismiss notification"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="py-12 text-center text-gray-400 text-xs font-medium">
                No notifications yet. When users like, comment, or follow you, updates will appear here!
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-3 bg-gray-50 border-t border-gray-100 text-center">
            <Link
              href="/dashboard"
              onClick={() => setIsOpen(false)}
              className="text-xs font-bold text-gray-600 hover:text-black transition-colors"
            >
              View Feed & Updates
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
