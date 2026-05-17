"use client";

import { useAuth } from "@/context/AuthContext";
import { Bell, Edit, Search } from "lucide-react";
import Link from "next/link";

export default function AuthenticatedNavbar() {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 h-[65px] border-b border-gray-100 bg-white px-4 sm:px-6 flex items-center justify-between">
      <div className="flex items-center gap-4 lg:gap-6">
        <div className="flex items-center gap-3">
          {/* <button className="text-gray-600 hover:text-black lg:hidden">
            <Menu className="h-6 w-6 stroke-[1.5]" />
          </button> */}
          <Link
            href="/"
            className="font-serif text-[1.4rem] md:text-[1.6rem] font-bold tracking-[-0.01em] text-black"
          >
            WriteNova
          </Link>
        </div>

        <div className="hidden sm:flex items-center rounded-full bg-gray-50 px-4 py-2 w-[240px] md:w-[320px] focus-within:bg-white focus-within:shadow-sm focus-within:border focus-within:border-gray-200 transition-all">
          <Search className="h-4 w-4 text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="Search"
            className="w-full bg-transparent text-[14px] text-gray-900 outline-none placeholder:text-gray-500"
          />
        </div>
      </div>

      <div className="flex items-center gap-4 sm:gap-6">
        <Link
          href="/new-story"
          className="hidden sm:flex items-center gap-2 text-gray-500 hover:text-black transition-colors"
        >
          <Edit className="h-5 w-5 stroke-[1.5]" />
          <span className="text-[14px] font-medium">Write</span>
        </Link>

        <button className="text-gray-500 hover:text-black transition-colors">
          <Bell className="h-5 w-5 stroke-[1.5]" />
        </button>

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
          {/* Dropdown Menu (Hidden by default, shown on hover for now) */}
          <div className="absolute right-0 top-full mt-2 w-48 rounded-md border border-gray-100 bg-white py-2 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
            <button
              onClick={logout}
              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
