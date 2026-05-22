import { create } from "zustand";
import api from "@/lib/api";

export const useArticleStore = create((set, get) => ({
  articles: [],
  loading: false,
  error: null,

  fetchArticles: async () => {
    set({ loading: true, error: null });
    try {
      const res = await api.get("/editor");
      if (res.data.success) {
        set({ articles: res.data.articles || [], loading: false });
      } else {
        set({ loading: false, error: "Failed to fetch articles" });
      }
    } catch (err) {
      set({ loading: false, error: err.message || "Failed to fetch articles" });
    }
  },

  deleteArticle: async (id) => {
    try {
      const res = await api.delete(`/editor/${id}`);
      if (res.data.success) {
        set((state) => ({
          articles: state.articles.filter((a) => a._id !== id),
        }));
        return true;
      }
      return false;
    } catch (err) {
      console.error("Delete failed:", err);
      return false;
    }
  },

  publishArticleStatus: (id, status, extraFields = {}) => {
    set((state) => ({
      articles: state.articles.map((a) =>
        a._id === id
          ? { ...a, ...extraFields, status }
          : a
      ),
    }));
  },
}));
