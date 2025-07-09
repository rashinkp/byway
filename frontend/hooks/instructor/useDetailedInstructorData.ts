import { useQuery } from "@tanstack/react-query";
import { getInstructorProfile } from "@/api/instructor.api";
import { useAuth } from "../auth/useAuth";

export function useDetailedInstructorData() {
	const { user, isLoading: authLoading, isAuthenticated } = useAuth();

	return useQuery({
		queryKey: ["instructor", user?.id],
		queryFn: async () => {
			if (!user?.id) throw new Error("User not authenticated");
			const response = await getInstructorProfile(user.id);
			return response;
		},
		enabled: !!user?.id && isAuthenticated && !authLoading,
		staleTime: 5 * 60 * 1000,
		gcTime: 10 * 60 * 1000,
		retry: (failureCount, error) => {
			if (error.message.includes("401") || error.message.includes("403")) {
				return false;
			}
			return failureCount < 3;
		},
	});
}
