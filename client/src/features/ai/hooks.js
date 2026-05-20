import { useState } from "react";
import { generateContent } from "./api";

export function useAIGeneration() {
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState("");

  const generate = async (prompt) => {
    setGenerating(true);
    try {
      const res = await generateContent(prompt);
      setResult(res.data.text || "");
    } catch (err) {
      console.error(err);
    } finally {
      setGenerating(false);
    }
  };

  return { generate, generating, result };
}
