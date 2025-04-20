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
        return category; // Return the original category for consistency
      }
    },
    onMutate: async (category) => {
      await queryClient.cancelQueries({ queryKey: ["categories"] });
      const previousCategories = queryClient.getQueryData<{
        data: Category[];
        total: number;
      }>(["categories", 1, 10, ""]);

      queryClient.setQueryData(["categories", 1, 10, ""], (old: any) => ({
        data: old?.data.map((cat: Category) =>
          cat.id === category.id
            ? {
                ...cat,
                isDeleted: !cat.deletedAt,
                updatedAt: new Date().toISOString(),
              }
            : cat
        ),
        total: old?.total || 0,
        page: old?.page || 1,
        limit: old?.limit || 10,
      }));

      return { previousCategories };
    },
    onSuccess: (updatedCategory, category) => {
      queryClient.setQueryData(["categories", 1, 10, ""], (old: any) => ({
        data: old?.data.map((cat: Category) =>
          cat.id === category.id ? updatedCategory : cat
        ),
        total: old?.total || 0,
        page: old?.page || 1,
        limit: old?.limit || 10,
      }));
      toast.success(
        category.deletedAt ? "Category restored" : "Category deleted"
      );
    },
    onError: (error: any, category, context: any) => {
      queryClient.setQueryData(
        ["categories", 1, 10, ""],
        context?.previousCategories
      );
      toast.error(
        `Failed to ${category.deletedAt ? "restore" : "delete"} category`,
        {
          description: error.message || "Please try again",
        }
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}
