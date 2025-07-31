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
				return await recoverCategory(category.id);
			} else {
				return await deleteCategory(category.id);
			}
		},
		onSuccess: (updatedCategory, category) => {
			// Update all category queries in cache
			queryClient.setQueriesData(
				{ queryKey: ["categories"] },
				(oldData: any) => {
					if (!oldData) return oldData;
					
					// Handle different possible data structures
					if (oldData.data && Array.isArray(oldData.data)) {
						// Structure: { data: Category[], total: number, page: number, limit: number }
						return {
							...oldData,
							data: oldData.data.map((cat: Category) =>
								cat.id === category.id ? updatedCategory : cat
							),
						};
					} else if (oldData.items && Array.isArray(oldData.items)) {
						// Structure: { items: Category[], total: number, totalPages: number }
						return {
							...oldData,
							items: oldData.items.map((cat: Category) =>
								cat.id === category.id ? updatedCategory : cat
							),
						};
					}
					
					return oldData;
				}
			);

			toast.success(
				category.deletedAt ? "Category restored" : "Category deleted"
			);
		},
		onError: (error: any, category) => {
			toast.error(
				`Failed to ${category.deletedAt ? "restore" : "delete"} category`
			);
		},
	});
}
