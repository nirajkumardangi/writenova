const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000/api";

export async function generateMetadata({ params }) {
  const { username, postSlug } = await params;

  try {
    const res = await fetch(`${SERVER_URL}/editor/public/${postSlug}`, {
      next: { revalidate: 60 },
    });

    if (res.ok) {
      const data = await res.json();
      const article = data?.article;

      if (article) {
        const title = article.title || "Story";
        const description =
          article.excerpt ||
          (article.content ? article.content.replace(/<[^>]+>/g, "").substring(0, 160) + "..." : "A story published on WriteNova.");
        const authorName = article.author?.username || username || "Author";
        const coverImage = article.coverImage;

        return {
          title: title,
          description: description,
          authors: [{ name: authorName }],
          openGraph: {
            title: title,
            description: description,
            type: "article",
            publishedTime: article.createdAt,
            authors: [authorName],
            images: coverImage ? [{ url: coverImage }] : [],
          },
          twitter: {
            card: coverImage ? "summary_large_image" : "summary",
            title: title,
            description: description,
            images: coverImage ? [coverImage] : [],
          },
        };
      }
    }
  } catch (error) {
    console.error("Failed to generate metadata for post:", error);
  }

  // Default fallback metadata
  return {
    title: "Story on WriteNova",
    description: "Read this story on WriteNova.",
  };
}

export default function ArticlePublicLayout({ children }) {
  return <>{children}</>;
}
