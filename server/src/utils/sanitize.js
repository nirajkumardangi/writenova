/**
 * Lightweight HTML Sanitizer to prevent Stored XSS attacks
 * Strips script tags, iframe, object, embed, inline event handlers, and javascript: URLs.
 */
export function sanitizeHtml(html) {
  if (typeof html !== "string") return "";

  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "")
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, "")
    .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, "")
    .replace(/on\w+\s*=\s*(["'])[\s\S]*?\1/gi, "")
    .replace(/on\w+\s*=\s*[^>\s]+/gi, "")
    .replace(/href\s*=\s*(["'])\s*javascript:[\s\S]*?\1/gi, 'href="#"');
}
