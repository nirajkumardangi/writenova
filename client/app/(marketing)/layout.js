import Navbar from "@/components/ui/navbar";
import Footer from "@/components/ui/footer";

export default function MarketingLayout({ children }) {
  return (
    <div className="flex min-h-screen flex-col bg-[#F7F4ED]">
      <Navbar />
      <main className="flex-1 relative flex flex-col justify-center">{children}</main>
      <Footer />
    </div>
  );
}
