import { NextRequest, NextResponse } from "next/server";
import { decodeToken, getTokenFromCookies } from "@/utils/jwt";
import { getCurrentUserServer } from "@/api/auth";

export async function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  const cookies = request.headers.get("cookie") || "";
  const token = getTokenFromCookies(cookies);
  let user = token ? decodeToken(token) : null;

  console.log("Middleware triggered:", {
    pathname,
    user: !!user,
    token: !!token,
    searchParams: Object.fromEntries(searchParams.entries()),
  });

  // If token exists, verify user status
  if (token && user) {
    try {
      const currentUser = await getCurrentUserServer(cookies);
      if (!currentUser) {
        console.log(
          "User is invalid or disabled, clearing cookie and redirecting to /login"
        );
        const response = NextResponse.redirect(new URL("/login", request.url));
        // Clear JWT cookie
        response.cookies.set("jwt", "", {
          path: "/",
          expires: new Date(0),
          httpOnly: true,
          sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
          secure: process.env.NODE_ENV === "production",
        });
        return response;
      }
    } catch (error) {
      console.error("Error verifying user in middleware:", error);
      const response = NextResponse.redirect(new URL("/login", request.url));
      // Clear JWT cookie on error
      response.cookies.set("jwt", "", {
        path: "/",
        expires: new Date(0),
        httpOnly: true,
        sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
        secure: process.env.NODE_ENV === "production",
      });
      return response;
    }
  }

  const publicRoutes = [
    "/login",
    "/signup",
    "/verify-otp",
    "/forgot-password",
    "/reset-password",
  ];

  // Check if current path is a public route
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

  if (isPublicRoute) {
    // Handle specific public route validations
    if (pathname === "/verify-otp" && !searchParams.get("email")) {
      console.log("Missing email for /verify-otp, redirecting to /signup");
      return NextResponse.redirect(new URL("/signup", request.url));
    }

    // For reset-password, only validate if directly accessing without parameters
    // if (
    //   pathname === "/reset-password" &&
    //   !searchParams.get("email") &&
    //   !searchParams.get("otp")
    // ) {
    //   console.log(
    //     "Missing params for /reset-password, redirecting to /forgot-password"
    //   );
    //   return NextResponse.redirect(new URL("/forgot-password", request.url));
    // }

    // Allow access to public routes without redirection
    console.log("Allowing access to public route:", pathname);
    return NextResponse.next();
  }

  // Protected routes handling
  if (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/instructor") ||
    pathname.startsWith("/user") ||
    pathname === "/"
  ) {
    if (!user) {
      console.log("No user, redirecting to /login from:", pathname);
      return NextResponse.redirect(new URL("/login", request.url));
    }

    if (pathname.startsWith("/admin") && user.role !== "ADMIN") {
      console.log("Non-admin user, redirecting to /login from:", pathname);
      return NextResponse.redirect(new URL("/login", request.url));
    }
    if (pathname.startsWith("/instructor") && user.role !== "INSTRUCTOR") {
      console.log("Non-instructor user, redirecting to /login from:", pathname);
      return NextResponse.redirect(new URL("/login", request.url));
    }
    if (pathname.startsWith("/user") && user.role !== "USER") {
      console.log("Non-user role, redirecting to /login from:", pathname);
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

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
