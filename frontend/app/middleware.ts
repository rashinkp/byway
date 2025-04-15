import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // Define public routes
  const publicRoutes = [
    "/login",
    "/signup",
    "/verify-otp",
    "/forgot-password",
    "/reset-password",
  ];

  // Check for JWT cookie via /auth/me
  let user = null;
  try {
    const response = await fetch("http://localhost:5001/api/v1/auth/me", {
      method: "GET",
      credentials: "include",
      headers: {
        Cookie: request.headers.get("cookie") || "",
      },
    });

    if (response.ok) {
      const { data } = await response.json();
      user = data && data.role ? data : null;
    }
  } catch (error) {
    console.error("Middleware auth check failed:", error);
    // Treat as unauthenticated
    user = null;
  }

  // Handle public routes
  if (publicRoutes.includes(pathname)) {
    if (pathname === "/verify-otp" && !searchParams.get("email") && !user) {
      return NextResponse.redirect(new URL("/signup", request.url));
    }
    if (
      pathname === "/reset-password" &&
      (!searchParams.get("email") || !searchParams.get("otp")) &&
      !user
    ) {
      return NextResponse.redirect(new URL("/forgot-password", request.url));
    }
    // Redirect authenticated users from public routes (except verify-otp/reset-password with valid params)
    if (user && (pathname === "/login" || pathname === "/signup")) {
      const role = user.role;
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
    return NextResponse.next();
  }

  // Allow /courses/* for all (authenticated or not)
  if (pathname.startsWith("/courses") && !pathname.includes("/lessons")) {
    return NextResponse.next();
  }

  // Restrict protected routes
  if (!user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const role = user.role;

  // Protect admin routes
  if (pathname.startsWith("/admin") && role !== "ADMIN") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Protect instructor routes
  if (pathname.startsWith("/instructor") && role !== "INSTRUCTOR") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Protect lesson routes
  if (pathname.includes("/lessons") && role !== "USER") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Allow authenticated users with correct role
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
