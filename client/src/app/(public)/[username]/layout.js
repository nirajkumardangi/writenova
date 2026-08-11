export async function generateMetadata({ params }) {
  const { username } = await params;
  const capitalized = username ? username.charAt(0).toUpperCase() + username.slice(1) : "Author";

  return {
    title: `${capitalized} (@${username})`,
    description: `Read stories and articles written by ${capitalized} on WriteNova.`,
    openGraph: {
      title: `${capitalized} (@${username}) — WriteNova`,
      description: `Read stories and articles written by ${capitalized} on WriteNova.`,
      type: "profile",
      username: username,
    },
    twitter: {
      card: "summary",
      title: `${capitalized} (@${username}) — WriteNova`,
      description: `Read stories and articles written by ${capitalized} on WriteNova.`,
    },
  };
}

export default function UserPublicLayout({ children }) {
  return <>{children}</>;
}
