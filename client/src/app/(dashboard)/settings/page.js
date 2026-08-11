"use client";

import { useState, useEffect } from "react";
import { useCurrentUser } from "@/features/auth/hooks";
import { useAuthStore } from "@/features/auth/store";
import { Calendar, Mail, Settings, Check, Edit2, Loader2, Camera, Upload } from "lucide-react";
import api from "@/lib/api";

export default function SettingsPage() {
  const { user } = useCurrentUser();
  const setUser = useAuthStore((state) => state.setUser);

  const [username, setUsername] = useState(user?.username || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [avatar, setAvatar] = useState(user?.avatar || "");
  const [loading, setLoading] = useState(false);
  const [savedMsg, setSavedMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (user) {
      setUsername(user.username || "");
      setBio(user.bio || "");
      setAvatar(user.avatar || "");
    }
  }, [user]);

  const joinDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "Recently";

  const handleImageFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg("Image size must be less than 5MB");
      return;
    }

    setErrorMsg("");
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatar(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSavedMsg("");
    setErrorMsg("");

    try {
      const res = await api.put("/users/profile", {
        username: username.trim(),
        bio: bio.trim(),
        avatar: avatar.trim() || undefined,
      });

      if (res.data.success) {
        setUser(res.data.user);
        setSavedMsg("Profile updated successfully!");
        setTimeout(() => setSavedMsg(""), 4000);
      }
    } catch (err) {
      console.error("Save profile error:", err);
      setErrorMsg(err.response?.data?.message || "Failed to update profile settings");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl py-8 px-4 sm:px-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="border-b border-gray-100 pb-6 mb-8">
        <h1 className="text-3xl font-serif font-bold text-gray-900 flex items-center gap-3">
          <Settings className="h-8 w-8 text-black stroke-[1.5]" />
          Profile Settings
        </h1>
        <p className="mt-1.5 text-sm text-gray-500 font-sans">
          Update your public profile details, bio, avatar photo, and author username.
        </p>
      </div>

      {/* Alerts */}
      {savedMsg && (
        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-semibold flex items-center gap-2 animate-in zoom-in-95 duration-200">
          <Check className="h-4 w-4 text-emerald-600 flex-shrink-0" />
          <span>{savedMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-800 rounded-2xl text-xs font-semibold flex items-center gap-2 animate-in zoom-in-95 duration-200">
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Edit Profile Form */}
      <form onSubmit={handleSaveProfile} className="space-y-8">
        {/* Profile Card Preview */}
        <div className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 border-b border-gray-100 pb-6">
            {/* Avatar Photo Upload Trigger */}
            <div className="relative group select-none cursor-pointer">
              {avatar || user?.avatar ? (
                <img
                  src={avatar || user?.avatar}
                  alt="Profile Avatar"
                  className="h-24 w-24 rounded-full object-cover border-2 border-gray-100 shadow-md group-hover:opacity-80 transition-opacity"
                />
              ) : (
                <div className="h-24 w-24 rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-3xl shadow-md group-hover:opacity-80 transition-opacity">
                  {(username || user?.username || "U").charAt(0).toUpperCase()}
                </div>
              )}

              <label
                htmlFor="avatar-upload"
                className="absolute inset-0 rounded-full bg-black/40 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-[10px] font-bold gap-1"
              >
                <Camera className="h-5 w-5" />
                Upload Photo
              </label>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                onChange={handleImageFileChange}
                className="hidden"
              />
            </div>

            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-2xl font-serif font-bold text-gray-900 mb-1">
                {username || user?.username || "Writer"}
              </h2>
              <p className="text-xs text-gray-400 font-semibold mb-3">@{username || user?.username || "writer"}</p>

              <div className="flex flex-wrap justify-center sm:justify-start gap-6 text-xs text-gray-500 font-medium">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span>{user?.email || "user@writenova.app"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span>Member since {joinDate}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-2xl text-xs font-semibold focus:outline-none focus:border-black focus:bg-white transition-all text-gray-900"
                placeholder="Enter username"
              />
              <p className="text-[11px] text-gray-400 mt-1">Your public author URL will be: writenova.app/{username || 'username'}</p>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                Profile Photo
              </label>
              <div className="flex flex-wrap gap-3 items-center mb-2">
                <label
                  htmlFor="avatar-upload-input"
                  className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2"
                >
                  <Upload className="h-4 w-4" /> Upload Image from Device
                </label>
                <input
                  id="avatar-upload-input"
                  type="file"
                  accept="image/*"
                  onChange={handleImageFileChange}
                  className="hidden"
                />
                <span className="text-xs text-gray-400 font-medium">OR paste URL below</span>
              </div>
              <input
                type="url"
                value={avatar.startsWith("data:") ? "" : avatar}
                onChange={(e) => setAvatar(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-2xl text-xs font-medium focus:outline-none focus:border-black focus:bg-white transition-all text-gray-900"
                placeholder="https://images.unsplash.com/photo-..."
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                Bio & Short Description
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-2xl text-xs font-medium focus:outline-none focus:border-black focus:bg-white transition-all resize-none text-gray-900"
                placeholder="Tell readers about yourself, your expertise, and topics you write about..."
              />
            </div>
          </div>

          {/* Save Button */}
          <div className="pt-4 border-t border-gray-100 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-black hover:bg-neutral-800 text-white rounded-full text-xs font-bold transition-all shadow-md cursor-pointer disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Edit2 className="h-3.5 w-3.5" />}
              {loading ? "Saving Profile..." : "Save Profile Changes"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
