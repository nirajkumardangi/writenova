import { create } from "zustand";

export const useUIStore = create((set) => ({
  isAuthModalOpen: false,
  authModalMode: "signup",

  openAuthModal: (mode = "signup") =>
    set({ isAuthModalOpen: true, authModalMode: mode }),
  closeAuthModal: () => set({ isAuthModalOpen: false }),
  setAuthModalMode: (mode) => set({ authModalMode: mode }),
}));
