"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/hooks/auth/useAuth";
import { ROUTES } from "@/constants/routes";
import AuthSkeleton from "@/components/skeleton/AuthSkeleton";
import OtpSkeleton from "@/components/skeleton/OtpSkeleton";
import { ReactNode } from "react";

interface AuthPageWrapperProps {
	children: ReactNode;
	requireAuth?: boolean; // If true, redirect to login if not authenticated
	redirectIfAuthenticated?: boolean; // If true, redirect if already authenticated
	skeletonType?: "auth" | "otp"; // Type of skeleton to show
}

export function AuthPageWrapper({
	children,
	requireAuth = false,
	redirectIfAuthenticated = false,
	skeletonType = "auth",
}: AuthPageWrapperProps) {
	const { isAuthenticated, isLoading, user } = useAuth();
	const router = useRouter();
	const pathname = usePathname();

	// Auto-detect skeleton type based on pathname if not provided
	const getSkeletonType = () => {
		if (skeletonType) return skeletonType;
		if (pathname.includes("verify-otp")) return "otp";
		return "auth";
	};

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
				console.log("Redirecting authenticated user to:", route);
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
		return getSkeletonType() === "otp" ? <OtpSkeleton /> : <AuthSkeleton />;
	}

	// Don't render children if we're redirecting
	if (requireAuth && !isAuthenticated) {
		return getSkeletonType() === "otp" ? <OtpSkeleton /> : <AuthSkeleton />;
	}

	if (redirectIfAuthenticated && isAuthenticated) {
		return getSkeletonType() === "otp" ? <OtpSkeleton /> : <AuthSkeleton />;
	}

	return <>{children}</>;
}
