import { useQuery } from "@tanstack/react-query";
import { getAllInstructors } from "@/api/instructor";
import { IInstructorWithUserDetails } from "@/types/instructor";
import { useAuthStore } from "@/stores/auth.store";
import { ApiResponse } from "@/types/apiResponse";

interface UseGetAllInstructorsParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  filterBy?: "All" | "Pending" | "Approved" | "Declined";
  includeDeleted?: boolean;
}

export const useGetAllInstructors = (params: UseGetAllInstructorsParams = {}) => {
  const { user } = useAuthStore();

  return useQuery<
    ApiResponse<{ items: IInstructorWithUserDetails[]; total: number; totalPages: number }>,
    Error,
    ApiResponse<{ items: IInstructorWithUserDetails[]; total: number; totalPages: number }>,
    ["instructors", UseGetAllInstructorsParams]
  >({
    queryKey: ["instructors", params],
    queryFn: () => getAllInstructors(params),
    enabled: !!user && user.role === "ADMIN",
  });
};
