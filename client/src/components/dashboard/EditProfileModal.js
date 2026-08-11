"use client";

import { useState } from "react";
import { X, Check, User, Loader2, Upload } from "lucide-react";
import { useCurrentUser } from "@/features/auth/hooks";
import api from "@/lib/api";

export default function EditProfileModal({ isOpen, onClose, onProfileSaved }) {
  const { user } = useCurrentUser();

  const [username, setUsername] = useState(user?.username || "");
  const [bio, setBio] = useState(
    user?.bio || "Writer on WriteNova. Sharing ideas, insights, and stories."
  );
  const [avatar, setAvatar] = useState(user?.avatar || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleImageFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5MB");
      return;
    }

    setError(null);
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatar(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await api.put("/users/profile", {
        username: username.trim(),
        bio: bio.trim(),
        avatar: avatar.trim() || undefined,
      });

      if (res.data.success) {
        setSuccess(true);
        if (onProfileSaved) {
          onProfileSaved(res.data.user);
        }
        setTimeout(() => {
          setSuccess(false);
          onClose();
        }, 1000);
      }
    } catch (err) {
      console.error("Failed to update profile:", err);
      setError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200 select-none">
      <div className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
          <div className="flex items-center gap-2">
            <User className="h-6 w-6 text-black stroke-[1.75]" />
            <h3 className="font-serif font-bold text-xl text-gray-900">Edit Profile</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-black rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 text-xs font-semibold rounded-xl border border-red-200">
            {error}
          </div>
        )}

        {success ? (
          <div className="py-12 flex flex-col items-center justify-center text-center">
            <div className="h-12 w-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3">
              <Check className="h-6 w-6" />
            </div>
            <h4 className="font-serif font-bold text-lg text-gray-900">Profile Updated!</h4>
            <p className="text-xs text-gray-500 mt-1">Your profile details have been saved to your account.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
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
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                Profile Photo
              </label>
              <div className="flex flex-wrap gap-3 items-center mb-2">
                <label
                  htmlFor="modal-avatar-upload"
                  className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2"
                >
                  <Upload className="h-4 w-4" /> Upload Image from Device
                </label>
                <input
                  id="modal-avatar-upload"
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
                placeholder="https://example.com/avatar.png"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                Short Bio / Tagline
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-2xl text-xs font-medium focus:outline-none focus:border-black focus:bg-white transition-all resize-none text-gray-900"
                placeholder="Tell readers about yourself..."
              />
            </div>

            <div className="pt-3 flex items-center justify-end gap-3 border-t border-gray-100">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 bg-gray-100 text-gray-600 rounded-full text-xs font-bold hover:bg-gray-200 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 bg-black text-white rounded-full text-xs font-bold hover:bg-neutral-800 transition-all flex items-center gap-2 cursor-pointer shadow-sm disabled:opacity-50"
              >
                {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
                {loading ? "Saving..." : "Save Profile"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
