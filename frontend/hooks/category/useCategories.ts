// src/hooks/useCategory.ts
"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Category, IGetAllCategoriesInput } from "@/types/category";
import { getAllCategories } from "@/api/category";



export function useCategories({
  page = 1,
  limit = 10,
  search = "",
  includeDeleted = false,
  sortOrder = "asc",
  filterBy = "All",
}: IGetAllCategoriesInput = {}) {
  const queryClient = useQueryClient();

  // Adjust includeDeleted based on filterBy
  const shouldIncludeDeleted = filterBy === "Inactive" ? true : 
                             filterBy === "Active" ? false : 
                             includeDeleted;

  const { data, isLoading, refetch ,error } = useQuery({
    queryKey: ["categories", page, limit, search, filterBy],
    queryFn: async () => {
      const { categories, total } = await getAllCategories({
        page,
        limit,
        search,
        includeDeleted: shouldIncludeDeleted,
        sortOrder,
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
    queryClient.setQueryData(["categories", page, limit, search, filterBy], {
      data: newCategories,
      total: newCategories.length,
      page,
      limit,
    });
  };

  return {
    categories: data?.data || [],
    total: data?.total || 0,
    loading: isLoading,
    refetch,
    setCategories,
    error
  };
}
