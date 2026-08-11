import Navbar from "@/components/ui/navbar";
import Footer from "@/components/ui/footer";

export const metadata = {
  title: "WriteNova — Write & Publish with AI",
  description: "Experience the next-generation publishing platform. Create compelling articles, generate drafts with AI, and grow your audience seamlessly.",
};

export default function MarketingLayout({ children }) {
  return (
    <div className="flex min-h-screen flex-col bg-[#F7F4ED]">
      <Navbar />
      <main className="flex-1 relative flex flex-col justify-center overflow-hidden">
        {children}
      </main>
      <Footer />
    </div>
  );
}
