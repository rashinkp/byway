import { useQuery } from "@tanstack/react-query";
import { getInstructorDashboard } from "@/api/dashboard";
import { InstructorDashboardResponse } from "@/types/instructor";

export function useInstructorDashboard() {
	return useQuery<InstructorDashboardResponse, Error>({
		queryKey: ["instructor-dashboard"],
		queryFn: getInstructorDashboard,
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
