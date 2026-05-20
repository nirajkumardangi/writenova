import DashboardAuthGuard from "@/components/auth/DashboardAuthGuard";
import AuthenticatedNavbar from "@/components/dashboard/navbar/AuthenticatedNavbar";
import Sidebar from "@/components/dashboard/sidebar/Sidebar";

export default function DashboardLayout({ children }) {
  return (
    <DashboardAuthGuard>
      <div className="flex h-screen w-full flex-col bg-white overflow-hidden">
        <AuthenticatedNavbar />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <main className="flex-1 overflow-y-auto bg-white border-l border-gray-100 pb-[60px] lg:pb-0">
            {children}
          </main>
        </div>
      </div>
    </DashboardAuthGuard>
  );
}
