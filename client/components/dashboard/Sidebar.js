"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Bookmark, User, FileText, BarChart2 } from "lucide-react";

const sidebarLinks = [
  { name: "Home", href: "/", icon: Home },
  { name: "Library", href: "/library", icon: Bookmark },
  { name: "Profile", href: "/profile", icon: User },
  { name: "Stories", href: "/stories", icon: FileText },
  { name: "Stats", href: "/stats", icon: BarChart2 },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <>
      {/* ── Desktop Sidebar (lg+) ── */}
      <aside className="hidden lg:flex w-[240px] flex-shrink-0 flex-col border-r border-gray-100 bg-white py-6">
        <nav className="flex flex-col gap-1 px-4">
          {sidebarLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center gap-4 rounded-md px-3 py-2 transition-colors ${
                  isActive
                    ? "text-black bg-gray-50 font-medium"
                    : "text-gray-500 hover:text-black hover:bg-gray-50"
                }`}
              >
                <Icon
                  className={`h-[22px] w-[22px] stroke-[1.5] ${
                    isActive ? "text-black" : "text-gray-500"
                  }`}
                />
                <span className="text-[15px]">{link.name}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* ── Mobile Bottom Nav (below lg) ── */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 flex h-[60px] items-center justify-around border-t border-gray-100 bg-white px-2">
        {sidebarLinks.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-md transition-colors ${
                isActive ? "text-black" : "text-gray-400 hover:text-black"
              }`}
            >
              <Icon className="h-[22px] w-[22px] stroke-[1.5]" />
              <span className="text-[10px] font-medium">{link.name}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
