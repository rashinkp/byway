// src/hooks/useCreateCategory.ts
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Category, CategoryFormData } from "@/types/category";
import { createCategory } from "@/api/category";

export function useCreateCategory() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: CategoryFormData) => createCategory(data),
		onMutate: async (newCategory) => {
			await queryClient.cancelQueries({ queryKey: ["categories"] });

			// Snapshot previous data
			const previousCategories = queryClient.getQueryData<{
				data: Category[];
				total: number;
			}>(["categories", 1, 10, ""]);

			// Optimistically add new category
			const tempCategory: Category = {
				id: "temp-id",
				name: newCategory.name,
				description: newCategory.description,
				deletedAt: null,
				createdAt: new Date().toLocaleDateString(),
				updatedAt: new Date().toLocaleDateString(),
			};
			queryClient.setQueryData(["categories", 1, 10, ""], (old: { data: Category[]; total: number; page: number; limit: number } | undefined) => ({
				data: [...(old?.data || []), tempCategory],
				total: (old?.total || 0) + 1,
				page: old?.page || 1,
				limit: old?.limit || 10,
			}));

			return { previousCategories };
		},
		onSuccess: (newCategory) => {
			// Update with real category data
			queryClient.setQueryData(["categories", 1, 10, ""], (old: { data: Category[]; total: number; page: number; limit: number } | undefined) => ({
				data: old?.data.map((cat: Category) =>
					cat.id === "temp-id" ? newCategory : cat,
				),
				total: old?.total || 0,
				page: old?.page || 1,
				limit: old?.limit || 10,
			}));
			toast.success("Category Created", {
				description: "The category has been created successfully.",
			});
		},
		onError: (error: Error, newCategory: CategoryFormData, context: { previousCategories: { data: Category[]; total: number } | undefined } | undefined) => {
			// Revert on error
			queryClient.setQueryData(
				["categories", 1, 10, ""],
				context?.previousCategories,
			);
			toast.error("Failed to create category", {
				description: error.message || "Please try again",
			});
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: ["categories"] });
		},
	});
}
