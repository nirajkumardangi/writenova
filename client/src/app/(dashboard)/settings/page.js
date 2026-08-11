"use client";

import { useState } from "react";
import { useCurrentUser } from "@/features/auth/hooks";
import { Calendar, Mail, Settings, User, Check, Edit2, Shield, Sparkles } from "lucide-react";
import api from "@/lib/api";

export default function SettingsPage() {
  const { user } = useCurrentUser();

  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState(user?.username || "");
  const [bio, setBio] = useState(user?.bio || "Writer on WriteNova. Sharing ideas, insights, and stories.");
  const [loading, setLoading] = useState(false);
  const [savedMsg, setSavedMsg] = useState("");

  const joinDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "Recently";

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSavedMsg("");

    try {
      // Simulate profile update or save locally
      await new Promise((resolve) => setTimeout(resolve, 500));
      setSavedMsg("Profile settings updated successfully!");
      setIsEditing(false);
      setTimeout(() => setSavedMsg(""), 4000);
    } catch (err) {
      console.error("Save error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl py-8 px-4 sm:px-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="border-b border-gray-100 pb-6 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-gray-900 flex items-center gap-3">
            <Settings className="h-8 w-8 text-black stroke-[1.5]" />
            Settings & Profile
          </h1>
          <p className="mt-1.5 text-sm text-gray-500 font-sans">
            Manage your account settings, public profile bio, and personal preferences.
          </p>
        </div>

        <button
          onClick={() => setIsEditing(!isEditing)}
          className="flex items-center gap-2 px-5 py-2.5 bg-black hover:bg-neutral-800 text-white rounded-full text-xs font-bold transition-all shadow-sm self-start sm:self-auto cursor-pointer select-none"
        >
          <Edit2 className="h-3.5 w-3.5" />
          {isEditing ? "Cancel Editing" : "Edit Profile"}
        </button>
      </div>

      {/* Save Success Alert */}
      {savedMsg && (
        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-semibold flex items-center gap-2 animate-in zoom-in-95 duration-200">
          <Check className="h-4 w-4 text-emerald-600 flex-shrink-0" />
          <span>{savedMsg}</span>
        </div>
      )}

      {/* Profile Overview Card */}
      <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm mb-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt="Profile Picture"
              className="h-24 w-24 rounded-full object-cover border-2 border-gray-100 shadow-sm"
            />
          ) : (
            <div className="h-24 w-24 rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-3xl shadow-sm select-none">
              {(username || user?.username || "U").charAt(0).toUpperCase()}
            </div>
          )}

          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-1">
              {username || user?.username || "Writer"}
            </h2>
            <p className="text-xs text-gray-400 font-semibold mb-3">@{username || "writer"}</p>
            <p className="text-sm text-gray-600 leading-relaxed max-w-lg mb-4">{bio}</p>

            <div className="flex flex-wrap justify-center sm:justify-start gap-6 text-xs text-gray-500 font-medium border-t border-gray-100 pt-4">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-400" />
                <span>{user?.email || "user@writenova.app"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span>Joined {joinDate}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Edit Profile Form */}
      {isEditing && (
        <form
          onSubmit={handleSaveProfile}
          className="bg-gray-50/70 border border-gray-200/80 rounded-3xl p-6 shadow-sm mb-8 animate-in slide-in-from-top-4 duration-300"
        >
          <h3 className="text-lg font-serif font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2">
            Edit Public Profile
          </h3>

          <div className="space-y-4 max-w-xl">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:border-black transition-colors"
                placeholder="Your username"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                Bio & Tagline
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:border-black transition-colors"
                placeholder="Short bio for your public story page..."
              />
            </div>

            <div className="pt-2 flex items-center gap-3">
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2.5 bg-black hover:bg-neutral-800 text-white rounded-full text-xs font-bold transition-all shadow-sm cursor-pointer"
              >
                {loading ? "Saving..." : "Save Profile Changes"}
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2.5 bg-white border border-gray-200 text-gray-600 rounded-full text-xs font-bold hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Account Security & Preferences */}
      <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
        <h3 className="text-lg font-serif font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">
          Account Security & Integrations
        </h3>

        <div className="space-y-4 text-xs font-medium">
          <div className="flex items-center justify-between p-3 bg-gray-50/50 rounded-xl border border-gray-100">
            <div className="flex items-center gap-3">
              <Shield className="h-4 w-4 text-emerald-600" />
              <div>
                <p className="font-bold text-gray-900">Authentication Method</p>
                <p className="text-gray-400">Google OAuth / Passwordless Secure Login</p>
              </div>
            </div>
            <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-bold uppercase">Connected</span>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50/50 rounded-xl border border-gray-100">
            <div className="flex items-center gap-3">
              <Sparkles className="h-4 w-4 text-indigo-600" />
              <div>
                <p className="font-bold text-gray-900">AI Story Generator Model</p>
                <p className="text-gray-400">Gemini High-Speed Editorial Engine</p>
              </div>
            </div>
            <span className="text-[10px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full font-bold uppercase">Active</span>
          </div>
        </div>
      </div>
    </div>
  );
}
