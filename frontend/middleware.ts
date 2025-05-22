import { NextRequest, NextResponse } from "next/server";
import { getCurrentUserServer } from "@/api/auth";

export async function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  const cookies = request.headers.get("cookie") || "";

  // Cache user data for the request
  let user = null;
  try {
    user = await getCurrentUserServer(cookies);
  } catch (error) {
    console.error("Middleware: Failed to fetch user:", error);
  }

  const publicRoutes = [
    "/login",
    "/signup",
    "/verify-otp",
    "/forgot-password",
    "/reset-password",
  ];

  // Handle public routes
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
    if (user) {
      const roleRedirects: Record<string, string> = {
        ADMIN: "/admin/dashboard",
        INSTRUCTOR: "/instructor/dashboard",
        USER: "/",
      };
      const redirectPath = roleRedirects[user.role] || "/";
      return NextResponse.redirect(new URL(redirectPath, request.url));
    }
    return NextResponse.next();
  }

  // Handle root route (/)
  if (pathname === "/") {
    if (!user) {
      return NextResponse.next();
    }
  }

  // Protect /admin, /instructor, and /user routes
  if (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/instructor") ||
    pathname.startsWith("/user")
  ) {
    if (!user) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    const role = user.role;
    if (pathname.startsWith("/admin") && role !== "ADMIN") {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    if (pathname.startsWith("/instructor") && role !== "INSTRUCTOR") {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // Pass user data to client side via headers
  const response = NextResponse.next();
  if (user) {
    response.headers.set("x-user", JSON.stringify(user));
  }
  return response;
}

export const config = {
  matcher: [
    "/",
    "/login",
    "/signup",
    "/verify-otp",
    "/forgot-password",
    "/reset-password",
    "/admin/:path*",
    "/instructor/:path*",
    "/user/:path*",
  ],
};
