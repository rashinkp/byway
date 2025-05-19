import { useQuery } from "@tanstack/react-query";
import { getAllInstructors } from "@/api/instructor";
import { IInstructorWithUserDetails } from "@/types/instructor";
import { useAuthStore } from "@/stores/auth.store";
import { toast } from "sonner";
import { ApiResponse } from "@/types/apiResponse";

export function useGetAllInstructors() {
  const { user } = useAuthStore();

  return useQuery<
    ApiResponse<{ items: IInstructorWithUserDetails[]; total: number; totalPages: number }>,
    Error,
    ApiResponse<{ items: IInstructorWithUserDetails[]; total: number; totalPages: number }>,
    ["instructors"]
  >({
    queryKey: ["instructors"],
    queryFn: (): Promise<ApiResponse<{ items: IInstructorWithUserDetails[]; total: number; totalPages: number }>> => {
      if (user?.role !== "ADMIN") {
        throw new Error("Unauthorized: Admin access required");
      }
      return getAllInstructors();
    },
    enabled: !!user && user.role === "ADMIN",
  });
}
