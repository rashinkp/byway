// src/hooks/useToggleDeleteCategory.ts
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Category } from "@/types/category";
import { deleteCategory, recoverCategory } from "@/api/category";

export function useToggleDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (category: Category) => {
      if (category.deletedAt) {
        const result = await recoverCategory(category.id);
        return result; 
      } else {
        await deleteCategory(category.id);
        return { ...category, deletedAt: new Date().toISOString() }; // Simulate deleted state
      }
    },
    onMutate: async (category) => {
      // Cancel queries for all category pages
      await queryClient.cancelQueries({ queryKey: ["categories"] });

      // Snapshot previous state for all matching queries
      const previousQueries = new Map();
      const queries = queryClient.getQueriesData<{
        data: Category[];
        total: number;
        page: number;
        limit: number;
      }>({ queryKey: ["categories"] });

      queries.forEach(([queryKey, data]) => {
        if (data) {
          previousQueries.set(queryKey, data);
          queryClient.setQueryData(queryKey, {
            ...data,
            data: data.data.map((cat: Category) =>
              cat.id === category.id
                ? {
                    ...cat,
                    deletedAt: category.deletedAt
                      ? null
                      : new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                  }
                : cat
            ),
          });
        }
      });

      return { previousQueries };
    },
    onSuccess: (updatedCategory, category) => {
      // Update all matching queries
      queryClient
        .getQueriesData<{
          data: Category[];
          total: number;
          page: number;
          limit: number;
        }>({ queryKey: ["categories"] })
        .forEach(([queryKey, data]) => {
          if (data) {
            queryClient.setQueryData(queryKey, {
              ...data,
              data: data.data.map((cat: Category) =>
                cat.id === category.id ? updatedCategory : cat
              ),
            });
          }
        });

      toast.success(
        category.deletedAt ? "Category restored" : "Category deleted",{description:'Category soft deleted successfully.'}
      );
    },
    onError: (error: any, category, context: any) => {
      // Revert all queries to previous state
      context?.previousQueries?.forEach((data: any, queryKey: any) => {
        queryClient.setQueryData(queryKey, data);
      });

      toast.error(
        `Failed to ${category.deletedAt ? "restore" : "delete"} category`,
        {
          description: error.message || "Please try again",
        }
      );
    },
    onSettled: () => {
      // Invalidate all category queries
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}
