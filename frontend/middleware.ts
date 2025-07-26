import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;

	// Allow static files, API, etc.
	if (
		pathname.startsWith("/_next") ||
		pathname.startsWith("/api") ||
		pathname.startsWith("/favicon.ico") ||
		pathname.includes(".")
	) {
		return NextResponse.next();
	}

	// Define which routes are public and which are protected
	const publicRoutes = [
		"/login",
		"/signup",
		"/verify-otp",
		"/forgot-password",
		"/reset-password",
		"/", // Home page is public
	];

	const protectedRoutes = [
		"/admin",
		"/instructor",
		"/user",
		"/chat"
	];

	const isPublicRoute = publicRoutes.some((route) =>
		pathname.startsWith(route),
	);

	const isProtectedRoute = protectedRoutes.some((route) =>
		pathname.startsWith(route),
	);

	// Check for access_token cookie
	const token = request.cookies.get("access_token")?.value;

	if (isPublicRoute) {
		return NextResponse.next();
	}

	if (isProtectedRoute) {
		if (!token) {
			// No token, redirect to login
			return NextResponse.redirect(new URL("/login", request.url));
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
		"/chat/:path*",
	],
};
