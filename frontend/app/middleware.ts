import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // Check for JWT cookie
  try {
    const response = await fetch("http://localhost:5001/api/v1/auth/me", {
      method: "GET",
      credentials: "include",
    });

    let data;
    if (response.ok) {
      ({ data } = await response.json());
    }

    // If fully authenticated, redirect from /login, /signup, /verify-otp
    if (
      response.ok &&
      data.role &&
      (pathname === "/login" ||
        pathname === "/signup" ||
        pathname === "/verify-otp")
    ) {
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

    // Allow /verify-otp with valid temporary JWT or email query
    if (pathname === "/verify-otp") {
      const email = searchParams.get("email");
      if (response.ok || email) {
        return NextResponse.next();
      }
      return NextResponse.redirect(new URL("/signup", request.url));
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
      pathname === "/verify-otp"
    ) {
      if (pathname === "/verify-otp" && !searchParams.get("email")) {
        return NextResponse.redirect(new URL("/signup", request.url));
      }
      return NextResponse.next();
    }
    if (pathname.startsWith("/courses")) {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: [
    "/login",
    "/signup",
    "/verify-otp",
    "/admin/:path*",
    "/instructor/:path*",
    "/courses/:courseId/lessons/:path*",
  ],
};
