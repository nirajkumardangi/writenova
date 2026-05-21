import DashboardAuthGuard from "@/components/auth/DashboardAuthGuard";
import AuthenticatedNavbar from "@/components/dashboard/navbar/AuthenticatedNavbar";
import SidebarLeft from "@/components/dashboard/sidebarLeft/Sidebar";
import SidebarRight from "@/components/dashboard/sidebarRight/Sidebar";

export default function DashboardLayout({ children }) {
  return (
    <DashboardAuthGuard>
      <div className="flex h-screen w-full flex-col bg-white overflow-hidden">
        <AuthenticatedNavbar />
        <div className="flex flex-1 overflow-hidden">
          <SidebarLeft />
          <main className="flex-1 overflow-y-auto no-scrollbar bg-white border-l border-gray-100 pb-[60px] lg:pb-0">
            {children}
          </main>
          <SidebarRight />
        </div>
      </div>
    </DashboardAuthGuard>
  );
}
