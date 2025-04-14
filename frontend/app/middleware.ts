import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check for JWT cookie
  try {
    const response = await fetch("http://localhost:5001/api/v1/auth/me", {
      method: "GET",
      credentials: "include",
    });

    const { data } = await response.json();

    // If authenticated, redirect from /login and /signup
    if (response.ok && (pathname === "/login" || pathname === "/signup")) {
      const role = data.role;
      if (role === "ADMIN") {
        return NextResponse.redirect(new URL("/admin/dashboard", request.url));
      } else if (role === "INSTRUCTOR") {
        return NextResponse.redirect(
          new URL("/instructor/dashboard", request.url)
        );
      } else {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    }

    // Protect role-based routes
    if (!response.ok) {
      if (
        pathname.startsWith("/admin") ||
        pathname.startsWith("/instructor") ||
        pathname.includes("/lessons")
      ) {
        return NextResponse.redirect(new URL("/login", request.url));
      }
      return NextResponse.next();
    }

    const role = data.role;

    // Protect admin routes
    if (pathname.startsWith("/admin") && role !== "ADMIN") {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // Protect instructor routes
    if (pathname.startsWith("/instructor") && role !== "INSTRUCTOR") {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // Protect student routes (e.g., lessons)
    if (pathname.includes("/lessons") && role !== "USER") {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    return NextResponse.next();
  } catch {
    // No valid session, allow public routes
    if (
      pathname === "/login" ||
      pathname === "/signup" ||
      pathname.startsWith("/courses")
    ) {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: [
    "/login",
    "/signup",
    "/admin/:path*",
    "/instructor/:path*",
    "/courses/:courseId/lessons/:path*",
  ],
};
