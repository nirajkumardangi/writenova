"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

function SidebarLink({ link, mobile }) {
  const pathname = usePathname();
  const Icon = link.icon;
  const isActive = pathname === link.href;

  if (mobile) {
    return (
      <Link
        href={link.href}
        className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-md transition-colors ${
          isActive ? "text-black" : "text-gray-400 hover:text-black"
        }`}
      >
        <Icon className="h-[22px] w-[22px] stroke-[1.5]" />
        <span className="text-[10px] font-medium">{link.name}</span>
      </Link>
    );
  }

  return (
    <Link
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
}

export default SidebarLink;
