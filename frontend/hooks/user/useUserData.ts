"use client";

import { useQuery } from "@tanstack/react-query";
import { User } from "@/types/user";
import { getUserData } from "@/api/users";
import { useAuthStore } from "@/stores/auth.store";

export interface UseUserDataReturn {
	data: User | undefined;
	isLoading: boolean;
	error: { message: string; code?: string } | null;
	refetch: () => void;
}

// Hook for fetching the current user's data
export function useUserData(): UseUserDataReturn {
	const { user, isInitialized, isLoading: authLoading, isHydrating } = useAuthStore();

	const { data, isLoading, error, refetch } = useQuery<User>({
		queryKey: ["userData", user?.id],
		queryFn: async () => {
			const userData = await getUserData();
			return userData;
		},
		enabled: !!user?.id && isInitialized && !authLoading && !isHydrating, // Only fetch when user is available, auth is initialized, and not hydrating
		staleTime: 5 * 60 * 1000, // 5 minutes
		gcTime: 10 * 60 * 1000, // 10 minutes
		retry: (failureCount, error) => {
			// Don't retry on 401/403 errors
			if (error.message.includes("401") || error.message.includes("403")) {
				return false;
			}
			return failureCount < 3;
		},
	});

	const mappedError = error
		? {
				message:
					error instanceof Error
						? error.message
						: "An unexpected error occurred",
				code:
					error instanceof Error && "code" in error
						? (error as any).code
						: undefined,
			}
		: null;

	return {
		data,
		isLoading,
		error: mappedError,
		refetch,
	};
}
