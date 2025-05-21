import { NextRequest, NextResponse } from "next/server";
import { getCurrentUserServer } from "@/api/auth";

export async function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  const cookies = request.headers.get("cookie") || "";
  const clearAuth = searchParams.get("clearAuth");

  // Handle login page with clearAuth=true
  if (pathname === "/login" && clearAuth) {
    const response = NextResponse.next();
    response.cookies.set("jwt", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      expires: new Date(0),
      path: "/",
    });
    return response;
  }

  const user = await getCurrentUserServer(cookies);

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
      const response = NextResponse.next(); // Allow unauthenticated access
      response.cookies.set("jwt", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        expires: new Date(0),
        path: "/",
      });
      return response;
    }
  }

  // Protect /admin, /instructor, and /user routes
  if (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/instructor") ||
    pathname.startsWith("/user")
  ) {
    if (!user) {
      const response = NextResponse.redirect(
        new URL("/login?clearAuth=true", request.url)
      );
      response.cookies.set("jwt", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        expires: new Date(0),
        path: "/",
      });
      response.headers.set("x-clear-auth", "true");
      return response;
    }
    const role = user.role;
    if (pathname.startsWith("/admin") && role !== "ADMIN") {
      return NextResponse.redirect(
        new URL("/login?clearAuth=true", request.url)
      );
    }
    if (pathname.startsWith("/instructor") && role !== "INSTRUCTOR") {
      return NextResponse.redirect(
        new URL("/login?clearAuth=true", request.url)
      );
    }
  }

  return NextResponse.next();
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
