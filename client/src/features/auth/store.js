import api from "@/lib/api";
import { create } from "zustand";

export const useAuthStore = create((set, get) => ({
  user: null,
  accessToken: null,
  loading: true,

  setAccessToken: (token) => set({ accessToken: token }),
  setUser: (userData) => set({ user: userData }),

  checkAuth: async () => {
    try {
      // interceptor handle the refresh process if there's no access token but a refresh cookie exists.
      const res = await api.get("/auth/me");

      // We expect the backend to return the user.
      set({ user: res.data.user, loading: false });
    } catch (error) {
      set({ user: null, accessToken: null, loading: false });
    }
  },

  login: (userData, token) => {
    set({ user: userData, accessToken: token });
  },

  logout: async () => {
    try {
      await api.post("/auth/logout");
    } catch (err) {
      // Ignore errors on logout
    }
    set({ user: null, accessToken: null });
  },
}));
