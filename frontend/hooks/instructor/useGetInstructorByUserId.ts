import { useQuery } from "@tanstack/react-query";
import { getInstructorByUserId } from "@/api/instructor";
import { IInstructorWithUserDetails } from "@/types/instructor";
import { ApiResponse } from "@/types/apiResponse";
import { useAuthStore } from "@/stores/auth.store";

export function useGetInstructorByUserId(enabled: boolean = true) {
  const { user } = useAuthStore();

  const queryResult = useQuery<
    ApiResponse<IInstructorWithUserDetails | null>,
    Error
  >({
    queryKey: ["instructor", user?.id],
    queryFn: getInstructorByUserId,
    enabled: !!user && enabled, // Only run if user exists and enabled is true
    retry: (failureCount, error) => {
      // Don't retry on 404 errors - it's normal for users to not have instructor records
      if (error.message.includes("404") || error.message.includes("not found")) {
        return false;
      }
      return failureCount < 3;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  return queryResult;
}
