// components/navbar/UserMenu.jsx ← CLIENT
"use client";

import { useAuthStore } from "@/stores/authStore";

export default function UserMenu() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  return (
    <div className="relative cursor-pointer group">
      {user?.profilePicture ? (
        <img
          src={user.profilePicture}
          alt="Profile"
          className="h-8 w-8 rounded-full object-cover"
        />
      ) : (
        <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-green-400 to-blue-500 flex items-center justify-center text-white font-bold text-sm">
          {user?.username?.charAt(0)?.toUpperCase() || "U"}
        </div>
      )}

      {/* Dropdown */}
      <div className="absolute right-0 top-full mt-2 w-48 rounded-md border border-gray-100 bg-white py-2 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
        <button
          onClick={logout}
          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
        >
          Sign out
        </button>
      </div>
    </div>
  );
}
