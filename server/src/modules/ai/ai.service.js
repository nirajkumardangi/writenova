import { GoogleGenAI } from "@google/genai";
import env from "../../config/env.js";

const ai = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });

export async function generateArticleService(prompt) {
  try {
    // Return the response stream object directly back to the controller
    return await ai.models.generateContentStream({
      model: "gemini-3.5-flash",
      contents: prompt,
    });
  } catch (error) {
    console.error("Error initiating Gemini stream:", error);
    throw error;
  }
}
