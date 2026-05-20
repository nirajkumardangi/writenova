import api from "@/lib/api";

export async function savePostContent(postId, content) {
  return api.put(`/editor/${postId}`, { content });
}
