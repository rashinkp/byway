import { useQuery } from "@tanstack/react-query";
import { getAllCourses } from "@/api/course";
import { CourseApiResponse } from "@/types/course";
import { useAuthStore } from "@/stores/auth.store";

export interface UseGetAllCoursesParams {
  page?: number;
  limit?: number;
  sortBy?: "createdAt" | "name" | "updatedAt" | 'title';
  sortOrder?: "asc" | "desc";
  search?: string;
  filterBy?: "All" | "Active" | "Draft" | "Inactive";
  includeDeleted?: boolean;
}

export function useGetAllCourses({
  page = 1,
  limit = 10,
  sortBy = "createdAt",
  sortOrder = "desc",
  search = "",
  filterBy = "All",
  includeDeleted = false,
}: UseGetAllCoursesParams) {
  const { user } = useAuthStore();

  return useQuery<CourseApiResponse, Error>({
    queryKey: [
      "courses",
      {
        page,
        limit,
        sortBy,
        sortOrder,
        search,
        filterBy,
        includeDeleted,
      },
    ],
    queryFn: () =>
      getAllCourses({
        page,
        limit,
        sortBy,
        sortOrder,
        search,
        filterBy,
        includeDeleted,
      }),
    enabled: !!user?.id,
    retry: 1,
  });
}
