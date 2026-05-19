"use client";

import { Home, Bookmark, User, FileText, BarChart2 } from "lucide-react";
import SidebarLink from "./SidebarLink";

const sidebarLinks = [
  { name: "Home", href: "/dashboard", icon: Home },
  { name: "Library", href: "/library", icon: Bookmark },
  { name: "Profile", href: "/profile", icon: User },
  { name: "Stories", href: "/stories", icon: FileText },
  { name: "Stats", href: "/stats", icon: BarChart2 },
];

export default function Sidebar() {
  return (
    <>
      {/* ── Desktop Sidebar ── */}
      <aside className="hidden lg:flex w-[240px] flex-shrink-0 flex-col border-r border-gray-100 bg-white py-6">
        <nav className="flex flex-col gap-1 px-4">
          {sidebarLinks.map((link) => (
            <SidebarLink key={link.name} link={link} />
          ))}
        </nav>
      </aside>

      {/* ── Mobile Bottom Nav ── */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 flex h-[60px] items-center justify-around border-t border-gray-100 bg-white px-2">
        {sidebarLinks.map((link) => (
          <SidebarLink key={link.name} link={link} mobile />
        ))}
      </nav>
    </>
  );
}
