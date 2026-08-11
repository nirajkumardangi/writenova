"use client";

import { useState } from "react";
import { X, Check, User, Sparkles } from "lucide-react";
import { useCurrentUser } from "@/features/auth/hooks";

export default function EditProfileModal({ isOpen, onClose, onProfileSaved }) {
  const { user } = useCurrentUser();

  const [username, setUsername] = useState(user?.username || "");
  const [bio, setBio] = useState(
    user?.bio || "Writer on WriteNova. Sharing ideas, insights, and stories."
  );
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      const updatedUser = {
        ...user,
        username: username.trim(),
        bio: bio.trim(),
      };

      // Save locally
      localStorage.setItem("writenova_custom_user", JSON.stringify(updatedUser));
      setLoading(false);
      setSuccess(true);

      if (onProfileSaved) {
        onProfileSaved(updatedUser);
      }

      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1000);
    }, 400);
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

        {success ? (
          <div className="py-12 flex flex-col items-center justify-center text-center">
            <div className="h-12 w-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3">
              <Check className="h-6 w-6" />
            </div>
            <h4 className="font-serif font-bold text-lg text-gray-900">Profile Updated!</h4>
            <p className="text-xs text-gray-500 mt-1">Your profile details have been saved.</p>
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
                className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-2xl text-xs font-semibold focus:outline-none focus:border-black focus:bg-white transition-all"
                placeholder="Enter username"
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
                className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-2xl text-xs font-medium focus:outline-none focus:border-black focus:bg-white transition-all resize-none"
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
                className="px-6 py-2.5 bg-black text-white rounded-full text-xs font-bold hover:bg-neutral-800 transition-all flex items-center gap-2 cursor-pointer shadow-sm"
              >
                {loading ? "Saving..." : "Save Profile"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
