"use client";

import { useQuery } from "@tanstack/react-query";
import { Category, IGetAllCategoriesInput } from "@/types/category";
import { getAllCategories } from "@/api/category";

interface UseCategoriesReturn {
  data: { items: Category[]; total: number; totalPages: number } | undefined;
  isLoading: boolean;
  error: { message: string } | null;
  refetch: () => void;
}

export function useCategories({
  page = 1,
  limit = 10,
  search = "",
  includeDeleted = false,
  sortOrder = "asc",
  sortBy = "name",
  filterBy = "All",
}: IGetAllCategoriesInput = {}): UseCategoriesReturn {
  // Handle negative sort orders
  let adjustedSortBy: IGetAllCategoriesInput["sortBy"] = sortBy;
  let adjustedSortOrder: IGetAllCategoriesInput["sortOrder"] = sortOrder;

  if (sortBy?.startsWith("-")) {
    adjustedSortBy = sortBy.slice(1) as IGetAllCategoriesInput["sortBy"];
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
    data: Category[];
    total: number;
    page: number;
    limit: number;
  }>({
    queryKey: ["categories", page, limit, search, sortBy, sortOrder, filterBy],
    queryFn: async () => {
      const { categories, total } = await getAllCategories({
        page,
        limit,
        search,
        includeDeleted: shouldIncludeDeleted,
        sortOrder: adjustedSortOrder,
        sortBy: adjustedSortBy,
        filterBy,
      });

      return {
        data: categories,
        total,
        page,
        limit,
      };
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
          items: data.data,
          total: data.total,
          totalPages: Math.ceil(data.total / limit),
        }
      : undefined,
    isLoading,
    error: mappedError,
    refetch,
  };
}
