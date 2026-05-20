import api from "@/lib/api";

export async function fetchPosts() {
  return api.get("/posts");
}
