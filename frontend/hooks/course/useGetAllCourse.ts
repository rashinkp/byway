"use client";

import { useQuery } from "@tanstack/react-query";
import { Course, IGetAllCoursesInput } from "@/types/course";
import { getAllCourses } from "@/api/course"; // Assume this API function exists

interface UseCoursesReturn {
  data: { items: Course[]; total: number; totalPages: number } | undefined;
  isLoading: boolean;
  error: { message: string } | null;
  refetch: () => void;
}

export function useGetAllCourses({
  page = 1,
  limit = 10,
  search = "",
  includeDeleted = false,
  sortOrder = "asc",
  sortBy = "title",
  filterBy = "All",
}: IGetAllCoursesInput = {}): UseCoursesReturn {
  let adjustedSortBy: IGetAllCoursesInput["sortBy"] = sortBy;
  let adjustedSortOrder: IGetAllCoursesInput["sortOrder"] = sortOrder;

  if (sortBy?.startsWith("-")) {
    adjustedSortBy = sortBy.slice(1) as IGetAllCoursesInput["sortBy"];
    adjustedSortOrder = sortOrder === "asc" ? "desc" : "asc";
  }

  // Adjust includeDeleted based on filterBy
  const shouldIncludeDeleted =
    filterBy === "Inactive"
      ? true
      : filterBy === "Active"
      ? false
      : includeDeleted;

  const { data, isLoading, error, refetch } = useQuery<{
    courses: Course[];
    total: number;
    totalPage: number;
  }>({
    queryKey: ["courses", page, limit, search, sortBy, sortOrder, filterBy],
    queryFn: async () => {
      const response = await getAllCourses({
        page,
        limit,
        search,
        includeDeleted: shouldIncludeDeleted,
        sortOrder: adjustedSortOrder,
        sortBy: adjustedSortBy,
        filterBy,
      });

      return response;
    },
  });

  // Map error to ensure it has a message property
  const mappedError = error
    ? {
        message:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      }
    : null;

  return {
    data: data
      ? {
          items: data.courses,
          total: data.total,
          totalPages: data.totalPage,
        }
      : undefined,
    isLoading,
    error: mappedError,
    refetch,
  };
}
