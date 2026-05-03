"use client";

import Link from "next/link";

const navLinks = [
  { label: "Features", href: "/" },
  { label: "Write", href: "/" },
  { label: "Sign in", href: "/" },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-black/10 bg-[#f2ede3]">
      <div className="mx-auto flex h-16 md:h-18 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link
          href="/"
          className="font-serif text-[1.4rem] md:text-[1.6rem] font-bold tracking-[-0.01em] text-[#181818]"
        >
          WriteNova AI
        </Link>

        {/* Action Area */}
        <div className="flex items-center gap-2">
          {/* Desktop Links - Hidden on Mobile */}
          <nav className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="px-4 py-2 text-[0.9375rem] text-[#181818]/70 transition-colors hover:text-[#181818]"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Get Started Button - Always Visible */}
          <Link
            href="/"
            className="rounded-full bg-[#181818] px-4 py-2 md:px-5 md:py-2.5 text-[0.875rem] md:text-[0.9375rem] font-medium text-white transition-opacity hover:opacity-90 active:scale-95"
          >
            Get started
          </Link>
        </div>
      </div>
    </header>
  );
}
