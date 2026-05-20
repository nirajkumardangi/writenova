import api from "@/lib/api";

export async function generateContent(prompt) {
  return api.post("/ai/generate", { prompt });
}
