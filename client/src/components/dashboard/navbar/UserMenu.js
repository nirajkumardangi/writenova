"use client";

import { useCurrentUser } from "@/features/auth/hooks";

export default function UserMenu() {
  const { user } = useCurrentUser();
  const { logout } = useCurrentUser();

  return (
    <div className="relative cursor-pointer group">
      {user?.avatar && (
        <img
          src={user.avatar}
          alt="Profile"
          className="h-8 w-8 rounded-full object-cover"
        />
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
