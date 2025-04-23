
"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Category, IGetAllCategoriesInput } from "@/types/category";
import { getAllCategories } from "@/api/category";

// Define the return type for useCategories
interface UseCategoriesReturn {
  categories: Category[];
  total: number;
  totalPages: number;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
  setCategories: (newCategories: Category[]) => void;
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
  const queryClient = useQueryClient();

  // Adjust includeDeleted based on filterBy
  const shouldIncludeDeleted =
    filterBy === "Inactive" ? true : filterBy === "Active" ? false : includeDeleted;

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
        sortOrder,
        sortBy,
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

  // Local state management for optimistic updates
  const setCategories = (newCategories: Category[]) => {
    queryClient.setQueryData(["categories", page, limit, search, sortBy, sortOrder, filterBy], {
      data: newCategories,
      total: newCategories.length,
      page,
      limit,
    });
  };

  return {
    categories: data?.data || [],
    total: data?.total || 0,
    totalPages: data ? Math.ceil(data.total / limit) : 0,
    loading: isLoading,
    error,
    refetch,
    setCategories,
  };
}
