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
      await queryClient.cancelQueries({ queryKey: ["categories"] });
      const previousCategories = queryClient.getQueryData<{
        data: Category[];
        total: number;
      }>(["categories", 1, 10, ""]);

      queryClient.setQueryData(["categories", 1, 10, ""], (old: any) => ({
        data: old?.data.map((cat: Category) =>
          cat.id === id
            ? { ...cat, ...data, updatedAt: new Date().toISOString() }
            : cat
        ),
        total: old?.total || 0,
        page: old?.page || 1,
        limit: old?.limit || 10,
      }));

      return { previousCategories };
    },
    onSuccess: (updatedCategory) => {
      queryClient.setQueryData(["categories", 1, 10, ""], (old: any) => ({
        data: old?.data.map((cat: Category) =>
          cat.id === updatedCategory.id ? updatedCategory : cat
        ),
        total: old?.total || 0,
        page: old?.page || 1,
        limit: old?.limit || 10,
      }));
      toast.success("Category updated successfully");
    },
    onError: (error: any, variables, context) => {
      queryClient.setQueryData(
        ["categories", 1, 10, ""],
        context?.previousCategories
      );
      toast.error("Failed to update category", {
        description: error.message || "Please try again",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}
