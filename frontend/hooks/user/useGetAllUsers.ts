"use client";

import { useQuery } from "@tanstack/react-query";
import { getAllUsers } from "@/api/users";
import { ApiResponse, IPaginatedResponse } from "@/types/apiResponse";
import { User, IGetAllUsersInput } from "@/types/user";

interface UseUsersReturn {
  data: { items: User[]; total: number; totalPages: number } | undefined;
  isLoading: boolean;
  error: { message: string } | null;
  refetch: () => void;
}

export function useGetAllUsers({
  page = 1,
  limit = 10,
  search = "",
  includeDeleted = false,
  sortOrder = "asc",
  sortBy = "name",
  filterBy = "All",
  role,
}: IGetAllUsersInput = {}): UseUsersReturn {
  // Handle negative sort orders
  let adjustedSortBy: IGetAllUsersInput["sortBy"] = sortBy;
  let adjustedSortOrder: IGetAllUsersInput["sortOrder"] = sortOrder;

  if (sortBy?.startsWith("-")) {
    adjustedSortBy = sortBy.slice(1) as IGetAllUsersInput["sortBy"];
    adjustedSortOrder = sortOrder === "asc" ? "desc" : "asc";
  }

  // Adjust includeDeleted based on filterBy
  const shouldIncludeDeleted =
    filterBy === "Inactive"
      ? true
      : filterBy === "Active"
      ? false
      : includeDeleted;

  const { data, isLoading, error, refetch } = useQuery<
    ApiResponse<IPaginatedResponse<User>>
  >({
    queryKey: [
      "users",
      page,
      limit,
      sortBy,
      sortOrder,
      includeDeleted,
      search,
      filterBy,
      role,
    ],
    queryFn: () =>
      getAllUsers({
        page,
        limit,
        search,
        includeDeleted: shouldIncludeDeleted,
        sortOrder: adjustedSortOrder,
        sortBy: adjustedSortBy,
        filterBy,
        role,
      }),
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
    data: data?.data
      ? {
          items: data.data.items,
          total: data.data.total,
          totalPages: data.data.totalPages,
        }
      : undefined,
    isLoading,
    error: mappedError,
    refetch,
  };
}
