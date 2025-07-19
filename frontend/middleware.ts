import { NextRequest, NextResponse } from "next/server";
// import { verifyToken } from "./lib/auth"; // Uncomment and implement this for JWT verification if needed

export async function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;

	if (
		pathname.startsWith("/_next") ||
		pathname.startsWith("/api") ||
		pathname.startsWith("/favicon.ico") ||
		pathname.includes(".")
	) {
		return NextResponse.next();
	}

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

	// --- Only use cookie for authentication ---
	let currentUser = null;
	const token = request.cookies.get("access_token")?.value;
	if (token) {
		try {
			// If using JWT, verify and decode here:
			// currentUser = await verifyToken(token);
			// For session-based, look up session here.
			// For now, just treat as authenticated if token exists:
			currentUser = { token };
		} catch (err) {
			// Invalid token, treat as unauthenticated
			currentUser = null;
		}
	}

	if (isPublicRoute) {
		// If authenticated and on home, redirect to dashboard by role (optional)
		// ... (your existing logic if needed)
		return NextResponse.next();
	}

	if (isProtectedRoute) {
		if (!currentUser) {
			return NextResponse.redirect(new URL("/login", request.url));
		}
		// Optionally, check user role here if you decode the token
		// ...
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
