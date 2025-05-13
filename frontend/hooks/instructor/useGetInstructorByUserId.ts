import { useQuery } from "@tanstack/react-query";
import { getInstructorByUserId } from "@/api/instructor";
import { IInstructorDetails } from "@/types/instructor";
import { ApiResponse } from "@/types/apiResponse";
import { useAuthStore } from "@/stores/auth.store";
import { toast } from "sonner";
import { useEffect } from "react";

export function useGetInstructorByUserId() {
  const { user } = useAuthStore();

  const queryResult = useQuery<ApiResponse<IInstructorDetails | null>, Error>({
    queryKey: ["instructor", user?.id],
    queryFn: getInstructorByUserId,
    enabled: !!user,
  });

  useEffect(() => {
    if (queryResult.error) {
      console.error("Fetching instructor failed:", queryResult.error.message);
      toast.error("Failed to Fetch Instructor Status", {
        description:
          queryResult.error.message ||
          "Something went wrong while fetching instructor status",
      });
    }
  }, [queryResult.error]);

  return queryResult;
}
