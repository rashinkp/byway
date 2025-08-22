"use client";

import { getDetailedUserData } from "@/api/users";
import { UserProfileType } from "@/types/user";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/auth.store";

export function useDetailedUserData() {
	const { user, isInitialized, isLoading: authLoading, isHydrating } = useAuthStore();



	return useQuery<UserProfileType>({
		queryKey: ["detailedUserData", user?.id],
		queryFn: getDetailedUserData,
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
}
