
import { getPublicLessons } from "@/api/lesson";
import { GetPublicLessonsParams, GetPublicLessonsResponse } from "@/types/lesson";
import { useQuery } from "@tanstack/react-query";

export const useGetPublicLessons = ({
  courseId,
  page = 1,
  limit = 10,
  sortBy = "order",
  sortOrder = "asc",
  search = "",
}: GetPublicLessonsParams) => {
  return useQuery<GetPublicLessonsResponse, Error>({
    queryKey: [
      "publicLessons",
      courseId,
      { page, limit, sortBy, sortOrder, search },
    ],
    queryFn: () =>
      getPublicLessons({
        courseId,
        page,
        limit,
        sortBy,
        sortOrder,
        search,
      }),
    enabled: !!courseId,
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
