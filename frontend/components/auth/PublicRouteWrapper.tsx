"use client";

import React, { useEffect, useMemo } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/hooks/auth/useAuth";
import { ROUTES } from "@/constants/routes";
import { ReactNode } from "react";

interface PublicRouteWrapperProps {
	children: ReactNode;
}

export function PublicRouteWrapper({ children }: PublicRouteWrapperProps) {
	const { isAuthenticated, isLoading, user } = useAuth();
	const router = useRouter();
	const pathname = usePathname();

	// Routes that should not redirect even if user is authenticated
	const authRoutes = useMemo(() => ["/login", "/signup", "/verify-otp", "/forgot-password", "/reset-password"], []);
	
	// User-specific routes that should not redirect (even though they're in public folder)
	const userRoutes = useMemo(() => ["/user/profile", "/user/cart", "/user/checkout", "/user/my-courses"], []);

	useEffect(() => {
		// Only redirect if we're not loading and user is authenticated
		if (!isLoading && isAuthenticated && user) {
			// Don't redirect if we're on an auth route
			if (authRoutes.some(route => pathname.startsWith(route))) {
				console.log("PublicRouteWrapper: On auth route, not redirecting");
				return;
			}

			// Don't redirect if we're on a user-specific route
			if (userRoutes.some(route => pathname.startsWith(route))) {
				console.log("PublicRouteWrapper: On user route, not redirecting");
				return;
			}

			// Only redirect from the home page to prevent redirect loops
			if (pathname === "/") {
				// Redirect to appropriate dashboard based on user role
				const route = ROUTES[user.role as keyof typeof ROUTES] || ROUTES.DEFAULT;
				console.log("PublicRouteWrapper: Redirecting authenticated user to:", route, "from:", pathname);
				router.push(route);
			}
		}
	}, [isAuthenticated, isLoading, user, router, pathname, authRoutes, userRoutes]);

	// Show children while loading or if not authenticated
	// The redirect will happen automatically when authentication is determined
	return <>{children}</>;
} 