"use client";

import { X } from "lucide-react";
import { useEffect } from "react";

export default function Modal({
  isOpen,
  onClose,
  children,
  position = "center", // "center" | "right"
  className = "",
  backdropClassName = "bg-white/95 sm:bg-[#F3F4F6]/80 sm:backdrop-blur-sm",
  showCloseButton = true,
}) {
  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Close when clicking outside the modal content
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const isRight = position === "right";

  return (
    <div
      className={`fixed inset-0 z-50 flex ${
        isRight ? "justify-end" : "items-center justify-center"
      } ${backdropClassName}`}
      onClick={handleBackdropClick}
    >
      <div
        className={`relative flex bg-white shadow-2xl overflow-y-auto ${
          isRight
            ? "h-full w-full max-w-[400px] flex-col"
            : "w-full max-w-[570px] flex-col items-center justify-center rounded"
        } ${className}`}
      >
        {showCloseButton && (
          <button
            onClick={onClose}
            className={`absolute z-10 text-gray-400 transition-colors hover:text-gray-800 cursor-pointer ${
              isRight ? "right-4 top-4" : "right-4 top-4 sm:right-6 sm:top-6"
            }`}
            aria-label="Close"
          >
            <X className="h-6 w-6 stroke-[1.5]" />
          </button>
        )}
        {children}
      </div>
    </div>
  );
}
