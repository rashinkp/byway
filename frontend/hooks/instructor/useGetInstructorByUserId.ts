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
  });

  return queryResult;
}
