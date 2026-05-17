"use client";

import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/ui/navbar";
import Footer from "@/components/ui/footer";
import AuthenticatedNavbar from "@/components/dashboard/AuthenticatedNavbar";
import Sidebar from "@/components/dashboard/Sidebar";

export default function MainLayout({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="h-screen w-full flex items-center justify-center bg-white"><div className="w-8 h-8 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div></div>;
  }

  if (user) {
    return (
      <div className="flex h-screen w-full flex-col bg-white overflow-hidden">
        <AuthenticatedNavbar />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <main className="flex-1 overflow-y-auto bg-white border-l border-gray-100 pb-[60px] lg:pb-0">
            {children}
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#F7F4ED]">
      <Navbar />
      <main className="flex-1 relative">{children}</main>
      <Footer />
    </div>
  );
}
