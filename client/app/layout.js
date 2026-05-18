import "./globals.css";

import { AuthProviders } from "@/providers/AuthProvider";
import MainLayout from "@/components/layout/MainLayout";

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className="scroll-smooth antialiased"
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

      <body className="h-screen overflow-hidden bg-[#F7F4ED] flex flex-col">
        <AuthProviders>
          <MainLayout>{children}</MainLayout>
        </AuthProviders>
      </body>
    </html>
  );
}
