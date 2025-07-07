import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
	const { pathname, searchParams } = request.nextUrl;
	// const cookies = request.headers.get("cookie") || "";

	console.log("Middleware triggered:", {
		pathname,
		searchParams: Object.fromEntries(searchParams.entries()),
		url: request.url,
		method: request.method,
	});

	// Skip middleware for static assets and API routes
	if (
		pathname.startsWith("/_next") ||
		pathname.startsWith("/api") ||
		pathname.startsWith("/favicon.ico") ||
		pathname.includes(".")
	) {
		console.log("Skipping middleware for static asset:", pathname);
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

	// Check if current path is a public route
	const isPublicRoute = publicRoutes.some((route) =>
		pathname.startsWith(route),
	);

	// Protected routes that require authentication
	const protectedRoutes = [
		"/admin",
		"/instructor", 
		"/user"
	];

	const isProtectedRoute = protectedRoutes.some((route) =>
		pathname.startsWith(route),
	);

	// Try to get user from x-user header only
	let currentUser = null;
	const xUserHeader = request.headers.get("x-user");
	if (xUserHeader) {
		try {
			const parsedUser = JSON.parse(xUserHeader);
			if (parsedUser && parsedUser.id && parsedUser.role) {
				currentUser = parsedUser;
				console.log("[Middleware] Using user from x-user header:", parsedUser);
			}
		} catch (err) {
			console.error("[Middleware] Failed to parse x-user header:", err);
		}
	}

	console.log("Middleware user check:", {
		pathname,
		hasUser: !!currentUser,
		userRole: currentUser?.role,
		isPublicRoute,
		isProtectedRoute,
	});

	if (isPublicRoute) {
		// Handle role-based redirection for authenticated users on public routes
		if (pathname === "/" && currentUser) {
			console.log("Authenticated user on home page, checking for redirection");
			if (currentUser.role === "ADMIN") {
				console.log("Admin user, redirecting to /admin");
				return NextResponse.redirect(new URL("/admin", request.url));
			} else if (currentUser.role === "INSTRUCTOR") {
				console.log("Instructor user, redirecting to /instructor");
				return NextResponse.redirect(new URL("/instructor", request.url));
			}
			// USER role stays on home page - no redirect needed
			console.log("User role, staying on home page");
		}

		// Allow access to other public routes without redirection
		console.log("Allowing access to public route:", pathname);
		const response = NextResponse.next();
		if (currentUser) {
			response.headers.set("x-user", JSON.stringify(currentUser));
		}
		return response;
	}

	// Protected routes handling
	if (isProtectedRoute) {
		if (!currentUser) {
			console.log("No user, redirecting to /login from:", pathname);
			return NextResponse.redirect(new URL("/login", request.url));
		}

		if (pathname.startsWith("/admin") && currentUser.role !== "ADMIN") {
			console.log("Non-admin user, redirecting to /login from:", pathname);
			return NextResponse.redirect(new URL("/login", request.url));
		}
		if (pathname.startsWith("/instructor") && currentUser.role !== "INSTRUCTOR") {
			console.log("Non-instructor user, redirecting to /login from:", pathname);
			return NextResponse.redirect(new URL("/login", request.url));
		}
		if (pathname.startsWith("/user") && currentUser.role !== "USER") {
			console.log("Non-user role, redirecting to /login from:", pathname);
			return NextResponse.redirect(new URL("/login", request.url));
		}
	}

	// Allow access to protected routes
	const response = NextResponse.next();
	if (currentUser) {
		response.headers.set("x-user", JSON.stringify(currentUser));
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
