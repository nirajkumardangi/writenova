"use client";

import { useAuthStore } from "@/features/auth/store";
import { Calendar, Mail, Settings, User } from "lucide-react";

export default function ProfilePage() {
  const user = useAuthStore((state) => state.user);

  return (
    <div className="mx-auto max-w-3xl py-8 px-4 sm:px-6">
      <div className="border-b border-gray-200 pb-5 mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-serif font-bold text-gray-900 flex items-center gap-3">
            <User className="h-8 w-8 stroke-[1.5]" />
            Profile
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Manage your public profile and personal information.
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-full text-sm font-medium hover:bg-gray-50 transition-colors">
          <Settings className="h-4 w-4" />
          Edit Profile
        </button>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm mb-6 flex flex-col sm:flex-row items-center sm:items-start gap-6">
        {user?.avatar ? (
          <img
            src={user.avatar}
            alt="Profile Picture"
            className="h-20 w-20 rounded-full object-cover border-2 border-gray-100"
          />
        ) : (
          <div className="h-20 w-20 rounded-full bg-gradient-to-tr from-green-400 to-blue-500 flex items-center justify-center text-white font-bold text-3xl">
            {user?.username?.charAt(0)?.toUpperCase() || "U"}
          </div>
        )}

        <div className="flex-1 text-center sm:text-left">
          <h2 className="text-xl font-bold text-gray-900 mb-1">
            {user?.username || "Writer"}
          </h2>
          <p className="text-sm text-gray-500 mb-4">{user?.email}</p>

          <div className="flex flex-wrap justify-center sm:justify-start gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-gray-400" />
              <span>{user?.email}</span>
            </div>
            {user?.createdAt && (
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span>
                  Joined {new Date(user.createdAt).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
