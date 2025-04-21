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

  if (pathname.startsWith("/courses") && !pathname.includes("/lessons")) {
    return NextResponse.next();
  }

  const { user, isInitialized } = useAuthStore.getState();
  
  if (!isInitialized) {
    return NextResponse.next();
  }

  if (!user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }


  //todo: update to protect routes;

 
  if (publicRoutes.includes(pathname)) {
    const roleRedirects: Record<string, string> = {
      ADMIN: "/admin/dashboard",
      INSTRUCTOR: "/instructor/dashboard",
      USER: "/",
    };
    const redirectPath = roleRedirects[user.role] || "/";
    return NextResponse.redirect(new URL(redirectPath, request.url));
  }

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
    "/",
  ],
};
