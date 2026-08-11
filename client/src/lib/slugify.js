export function slugify(text) {
  if (!text) return "";
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}

export function getStorySlug(story) {
  if (!story) return "";
  if (story.slug && story.slug.trim()) return story.slug;
  if (story.title && story.title.trim()) return slugify(story.title);
  return story._id || "";
}
