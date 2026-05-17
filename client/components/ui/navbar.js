"use client";

import Link from "next/link";
import AuthModal from "../auth/auth-modal";
import { useAuth } from "@/context/AuthContext";

const navLinks = [
  { label: "Features", href: "/" },
  { label: "Write", href: "/" },
];

export default function Navbar() {
  const { isAuthModalOpen, closeAuthModal, authModalMode, setAuthModalMode, openAuthModal } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b border-black/10 bg-[#f2ede3]">
      <div className="mx-auto flex h-16 md:h-18 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link
          href="/"
          className="font-serif text-[1.4rem] md:text-[1.6rem] font-bold tracking-[-0.01em] text-[#181818]"
        >
          WriteNova
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
            <button
              onClick={() => openAuthModal("login")}
              className="px-4 py-2 text-[0.9375rem] text-[#181818]/70 transition-colors hover:text-[#181818] cursor-pointer"
            >
              Sign in
            </button>
          </nav>

          {/* Get Started Button - Always Visible */}
          <button
            onClick={() => openAuthModal("signup")}
            className="rounded-full bg-[#181818] px-4 py-2 md:px-5 md:py-2.5 text-[0.875rem] md:text-[0.9375rem] font-medium text-white transition-opacity hover:opacity-90 active:scale-95 cursor-pointer"
          >
            Get started
          </button>
        </div>
      </div>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={closeAuthModal}
        mode={authModalMode}
        setMode={setAuthModalMode}
      />
    </header>
  );
}
