import { useQuery } from "@tanstack/react-query";
import { getAllCourses } from "@/api/course";
import { CourseApiResponse } from "@/types/course";
import { useAuthStore } from "@/stores/auth.store";

interface UseGetAllCoursesParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  search?: string;
  filterBy?: "All" | "Active" | "Draft";
}

export function useGetAllCourses({
  page = 1,
  limit = 10,
  sortBy = "createdAt",
  sortOrder = "desc",
  search = "",
  filterBy = "All",
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
        instructorId: user?.id,
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
        instructorId: user?.id || "",
      }),
    enabled: !!user?.id,
    retry: 1,
  });
}
