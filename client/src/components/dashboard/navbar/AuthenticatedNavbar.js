import { Edit } from "lucide-react";
import Link from "next/link";
import UserMenu from "./UserMenu";
import SearchBar from "./SearchBar";
import NotificationsMenu from "./NotificationsMenu";

export default function AuthenticatedNavbar() {
  return (
    <header className="sticky top-0 z-50 h-[65px] border-b border-gray-100 bg-white px-4 sm:px-6 flex items-center justify-between">
      <div className="flex items-center gap-4 lg:gap-6">
        <Link
          href="/dashboard"
          className="font-serif text-[1.4rem] md:text-[1.6rem] font-bold tracking-[-0.01em] text-black hover:opacity-80 transition-opacity"
        >
          WriteNova
        </Link>
      </div>

      <SearchBar />

      <div className="flex items-center gap-4 sm:gap-6">
        <Link
          href="/editor/new"
          className="hidden sm:flex items-center gap-2 text-gray-500 hover:text-black transition-colors"
        >
          <Edit className="h-5 w-5 stroke-[1.5]" />
          <span className="text-[14px] font-medium">Write</span>
        </Link>

        <NotificationsMenu />

        <UserMenu />
      </div>
    </header>
  );
}
