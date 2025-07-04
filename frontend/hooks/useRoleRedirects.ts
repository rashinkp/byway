// src/hooks/useRoleRedirects.ts
"use client";

import { useRouter } from "next/navigation";

export function useRoleRedirect() {
	const router = useRouter();

	const redirectByRole = (role: string) => {
		const roleRedirects: Record<string, string> = {
			ADMIN: "/admin",
			INSTRUCTOR: "/instructor",
			USER: "/",
		};
		const redirectPath = roleRedirects[role] || "/";
		router.push(redirectPath);
	};

	return { redirectByRole };
}
