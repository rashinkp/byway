"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/auth/useAuth";
import { ROUTES } from "@/constants/routes";
import { ReactNode } from "react";
import { LoadingSpinner } from "../ui/LoadingSpinner";

interface AuthPageWrapperProps {
	children: ReactNode;
	requireAuth?: boolean; // If true, redirect to login if not authenticated
	redirectIfAuthenticated?: boolean; // If true, redirect if already authenticated
	skeletonType?: "auth" | "otp"; // Type of skeleton to show
}

export function AuthPageWrapper({
	children,
	requireAuth = false,
	redirectIfAuthenticated = false
}: AuthPageWrapperProps) {
	const { isAuthenticated, isLoading, user } = useAuth();
	const router = useRouter();


	useEffect(() => {
		if (!isLoading) {
			if (requireAuth && !isAuthenticated) {
				// Redirect to login if auth is required but user is not authenticated
				router.push("/login");
				return;
			}

			if (redirectIfAuthenticated && isAuthenticated && user) {
				// Redirect to appropriate dashboard if user is already authenticated
				const route =
					ROUTES[user.role as keyof typeof ROUTES] || ROUTES.DEFAULT;
				router.push(route);
				return;
			}
		}
	}, [
		isAuthenticated,
		isLoading,
		user,
		router,
		requireAuth,
		redirectIfAuthenticated,
	]);

	// Show appropriate skeleton while loading or during redirects
	if (isLoading) {
		return <LoadingSpinner />;
	}

	// Don't render children if we're redirecting
	if (requireAuth && !isAuthenticated) {
		return <LoadingSpinner />;
	}

	if (redirectIfAuthenticated && isAuthenticated) {
		return <LoadingSpinner />;
	}

	return <>{children}</>;
}
