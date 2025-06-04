import { useQuery } from "@tanstack/react-query";
import { getInstructorDetails } from "@/api/instructor";
import { IInstructorDetails } from "@/types/instructor";
import { ApiResponse } from "@/types/apiResponse";

export function useGetInstructorDetails(
  instructorId: string,
  enabled: boolean = true
) {
  const queryResult = useQuery<
    ApiResponse<IInstructorDetails | null>,
    Error
  >({
    queryKey: ["instructorDetails", instructorId],
    queryFn: () => getInstructorDetails(instructorId),
    enabled: !!instructorId && enabled, // Only run if instructorId exists and enabled is true
  });

  return queryResult;
}
