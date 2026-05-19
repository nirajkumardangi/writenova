import { NextResponse } from "next/server";

export function proxy(request) {
  const { pathname } = request.nextUrl;
  const refreshToken = request.cookies.get("refresh_token")?.value;

  // Define protected dashboard routes
  const isDashboardRoute =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/library") ||
    pathname.startsWith("/profile") ||
    pathname.startsWith("/stories") ||
    pathname.startsWith("/stats");

  // Define public marketing routes
  const isPublicRoute = pathname === "/";

  // If trying to access dashboard but not logged in, redirect to landing
  if (isDashboardRoute && !refreshToken) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // If logged in and trying to access landing, redirect to dashboard
  if (isPublicRoute && refreshToken) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/dashboard/:path*",
    "/library/:path*",
    "/profile/:path*",
    "/stories/:path*",
    "/stats/:path*",
  ],
};
