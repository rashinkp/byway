// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { useAuthStore } from "@/stores/auth.store";

export async function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  const publicRoutes = [
    "/login",
    "/signup",
    "/verify-otp",
    "/forgot-password",
    "/reset-password",
  ];

  // For public routes, allow access
  if (publicRoutes.includes(pathname)) {
    if (pathname === "/verify-otp" && !searchParams.get("email")) {
      return NextResponse.redirect(new URL("/signup", request.url));
    }
    if (
      pathname === "/reset-password" &&
      (!searchParams.get("email") || !searchParams.get("otp"))
    ) {
      return NextResponse.redirect(new URL("/forgot-password", request.url));
    }
    return NextResponse.next();
  }

  // For course listing pages, allow access
  if (pathname.startsWith("/courses") && !pathname.includes("/lessons")) {
    return NextResponse.next();
  }

  // Get user from auth store
  const { user, isInitialized } = useAuthStore.getState();
  
  // If not initialized, allow the request to proceed
  // The auth store will handle initialization
  if (!isInitialized) {
    return NextResponse.next();
  }

  // If initialized but no user, redirect to login
  if (!user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // If authenticated and trying to access auth pages, redirect to appropriate dashboard
  if (publicRoutes.includes(pathname)) {
    const roleRedirects: Record<string, string> = {
      ADMIN: "/admin/dashboard",
      INSTRUCTOR: "/instructor/dashboard",
      USER: "/dashboard",
    };
    const redirectPath = roleRedirects[user.role] || "/dashboard";
    return NextResponse.redirect(new URL(redirectPath, request.url));
  }

  // Check role-based access
  const role = user.role;
  if (pathname.startsWith("/admin") && role !== "ADMIN") {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  if (pathname.startsWith("/instructor") && role !== "INSTRUCTOR") {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  if (pathname.includes("/lessons") && role !== "USER") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/login",
    "/signup",
    "/verify-otp",
    "/forgot-password",
    "/reset-password",
    "/admin/:path*",
    "/instructor/:path*",
    "/courses/:courseId/lessons/:path*",
    "/dashboard",
  ],
};
