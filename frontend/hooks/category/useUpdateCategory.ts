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
		onSuccess: (updatedCategory, variables) => {
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
								cat.id === variables.id ? updatedCategory : cat
							),
						};
					} else if (oldData.items && Array.isArray(oldData.items)) {
						// Structure: { items: Category[], total: number, totalPages: number }
						return {
							...oldData,
							items: oldData.items.map((cat: Category) =>
								cat.id === variables.id ? updatedCategory : cat
							),
						};
					}
					
					return oldData;
				}
			);

			toast.success("Category Updated", {
				description: "The category has been updated successfully.",
			});
		},
		onError: (error: any) => {
			toast.error("Failed to update category", {
				description: error.message || "Please try again",
			});
		},
	});
}
