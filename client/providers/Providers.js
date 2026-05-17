"use client";

import { AuthProvider } from "@/context/AuthContext";
import GoogleProvider from "@/components/auth/google-provider";

export function Providers({ children }) {
  return (
    <GoogleProvider>
      <AuthProvider>{children}</AuthProvider>
    </GoogleProvider>
  );
}
