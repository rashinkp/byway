// src/hooks/useCategory.ts
"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Category } from "@/types/category";
import { getAllCategories } from "@/api/category";

export interface UseCategoriesProps {
  page?: number;
  limit?: number;
  search?: string;
  includeDeleted?: boolean;
  sortBy?: string;
}

export function useCategories({
  page = 1,
  limit = 10,
  search = "",
  includeDeleted = false,
  sortBy = "name",
}: UseCategoriesProps = {}) {
  const queryClient = useQueryClient();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["categories", page, limit, search],
    queryFn: async () => {
      const { categories, total } = await getAllCategories({
        page,
        limit,
        search,
        includeDeleted,
        sortBy,
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
    queryClient.setQueryData(["categories", page, limit, search], {
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
  };
}
