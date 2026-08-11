import "./globals.css";

import { AuthProviders } from "@/providers/AuthProvider";

export const metadata = {
  title: {
    default: "WriteNova — AI-Powered Publishing Platform",
    template: "%s | WriteNova",
  },
  description:
    "WriteNova is an elegant publishing platform for modern writers, powered by AI story generation, seamless editor experience, and audience insights.",
  keywords: ["blogging", "writing", "AI article generator", "publishing platform", "WriteNova"],
  authors: [{ name: "WriteNova Team" }],
  creator: "WriteNova",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://writenova.app",
    siteName: "WriteNova",
    title: "WriteNova — AI-Powered Publishing Platform",
    description:
      "WriteNova is an elegant publishing platform for modern writers, powered by AI story generation, seamless editor experience, and audience insights.",
  },
  twitter: {
    card: "summary_large_image",
    title: "WriteNova — AI-Powered Publishing Platform",
    description:
      "WriteNova is an elegant publishing platform for modern writers, powered by AI story generation.",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className="scroll-smooth antialiased"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Playfair+Display:ital,wght@0,500;0,700;1,500&display=swap"
          rel="stylesheet"
        />
      </head>

      <body className="h-screen bg-[#F7F4ED] text-[#171717]">
        <AuthProviders>{children}</AuthProviders>
      </body>
    </html>
  );
}
