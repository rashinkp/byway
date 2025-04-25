// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { getCurrentUserServer } from "@/api/auth";

export async function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // Get cookies as a string (includes securecookie)
  const cookies = request.headers.get("cookie") || "";
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
    // Validate query params
    if (pathname === "/verify-otp" && !searchParams.get("email")) {
      return NextResponse.redirect(new URL("/signup", request.url));
    }
    if (
      pathname === "/reset-password" &&
      (!searchParams.get("email") || !searchParams.get("otp"))
    ) {
      return NextResponse.redirect(new URL("/forgot-password", request.url));
    }

    // Redirect authenticated users to role-specific dashboards
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

  // Allow public access to course pages (excluding lessons)
  if (pathname.startsWith("/courses") && !pathname.includes("/lessons")) {
    return NextResponse.next();
  }

  // Require authentication for protected routes
  if (!user) {
    //remove token from secure cookie and from local storage

    const response = NextResponse.redirect(new URL("/login?clearAuth=true", request.url));

    response.cookies.set("jwt", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      expires: new Date(0), // Expire immediately to delete the cookie
      path: "/",
    });

    response.headers.set("x-clear-auth", "true");
    return response;
  }

  // Role-based route protection
  const role = user.role;

  if (pathname.startsWith("/admin") && role !== "ADMIN") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (pathname.startsWith("/instructor") && role !== "INSTRUCTOR") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Allow USER and INSTRUCTOR to access lesson routes
  if (pathname.includes("/lessons") && !["USER", "INSTRUCTOR"].includes(role)) {
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
