import { useQuery } from "@tanstack/react-query";
import { getInstructorByUserId } from "@/api/instructor";
import { IInstructorDetails } from "@/types/instructor";
import { ApiResponse } from "@/types/apiResponse";
import { useAuthStore } from "@/stores/auth.store";

export function useGetInstructorByUserId() {
  const { user } = useAuthStore();

  const queryResult = useQuery<ApiResponse<IInstructorDetails | null>, Error>({
    queryKey: ["instructor", user?.id],
    queryFn: getInstructorByUserId,
    enabled: !!user,
  });

  return queryResult;
}
