import { useState } from "react";
import { savePostContent } from "./api";

export function useAutosave(postId) {
  const [saving, setSaving] = useState(false);

  const save = async (content) => {
    setSaving(true);
    try {
      await savePostContent(postId, content);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return { save, saving };
}
