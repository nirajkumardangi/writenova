"use client";

import { Home, Bookmark, User, FileText, BarChart2, CreditCard } from "lucide-react";
import SidebarLink from "./SidebarLink";

const sidebarLinks = [
  { name: "Home", href: "/dashboard", icon: Home },
  { name: "Posts", href: "/posts", icon: FileText },
  { name: "Drafts", href: "/drafts", icon: Bookmark },
  { name: "Analytics", href: "/analytics", icon: BarChart2 },
  { name: "Billing", href: "/billing", icon: CreditCard },
  { name: "Settings", href: "/settings", icon: User },
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
