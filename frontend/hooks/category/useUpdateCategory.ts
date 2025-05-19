// src/hooks/useUpdateCategory.ts
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Category, CategoryFormData } from "@/types/category";
import { updateCategory } from "@/api/category";


export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: CategoryFormData }) =>
      updateCategory(id, data),
    onMutate: async ({ id, data }) => {
      // Cancel any ongoing queries to avoid conflicts
      await queryClient.cancelQueries({ queryKey: ["categories"] });

      // Get previous categories from cache
      const previousCategories = queryClient.getQueryData<{
        data: Category[];
        total: number;
        page: number;
        limit: number;
      }>(["categories", 1, 10, ""]);

      // Optimistically update the cache
      queryClient.setQueryData(["categories", 1, 10, ""], (old: any) => {
        // If cache is empty, create a new entry with the updated category
        if (!old || !old.data) {
          return {
            data: [
              { id, ...data, updatedAt: new Date().toISOString() } as Category,
            ],
            total: 1,
            page: 1,
            limit: 10,
          };
        }

        // Update existing category in the list
        return {
          ...old,
          data: old.data.map((cat: Category) =>
            cat.id === id
              ? { ...cat, ...data, updatedAt: new Date().toISOString() }
              : cat
          ),
        };
      });

      return { previousCategories };
    },
    onSuccess: (updatedCategory) => {
      // Update cache with server response
      queryClient.setQueryData(["categories", 1, 10, ""], (old: any) => {
        if (!old || !old.data) {
          return {
            data: [updatedCategory],
            total: 1,
            page: 1,
            limit: 10,
          };
        }
        return {
          ...old,
          data: old.data.map((cat: Category) =>
            cat.id === updatedCategory.id ? updatedCategory : cat
          ),
        };
      });
      toast.success("Category Updated", {
        description: "The category has been updated successfully.",
      });
    },
    onError: (error: any, variables, context) => {
      // Roll back to previous categories on error
      queryClient.setQueryData(
        ["categories", 1, 10, ""],
        context?.previousCategories
      );
      toast.error("Failed to update category", {
        description: error.message || "Please try again",
      });
    },
    onSettled: () => {
      // Invalidate queries to refetch fresh data
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}
