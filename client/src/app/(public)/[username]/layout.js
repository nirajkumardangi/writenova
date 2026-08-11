import AuthenticatedNavbar from "@/components/dashboard/navbar/AuthenticatedNavbar";
import SidebarLeft from "@/components/dashboard/sidebarLeft/Sidebar";

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
  return (
    <div className="flex h-screen w-full flex-col bg-white overflow-hidden">
      <AuthenticatedNavbar />
      <div className="flex flex-1 overflow-hidden">
        <SidebarLeft />
        <main className="flex-1 overflow-y-auto no-scrollbar bg-white pb-[60px] lg:pb-0 border-l border-gray-100">
          {children}
        </main>
      </div>
    </div>
  );
}
