"use client";

import { clearCart } from "@/api/cart";
import { ICart } from "@/types/cart";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useCartStore } from "@/stores/cart.store";

export function useClearCart() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: () => clearCart(),
		onMutate: async () => {
			// Cancel queries for all cart pages
			await queryClient.cancelQueries({ queryKey: ["cart"] });

			// Snapshot previous state for all matching queries
			const previousQueries = new Map();
			const queries = queryClient.getQueriesData<{
				data: ICart[];
				total: number;
				page: number;
				limit: number;
			}>({ queryKey: ["cart"] });

			queries.forEach(([queryKey, data]) => {
				if (data) {
					previousQueries.set(queryKey, data);
					queryClient.setQueryData(queryKey, {
						...data,
						data: [],
						total: 0,
					});
				}
			});

			return { previousQueries };
		},
		onSuccess: () => {
			useCartStore.getState().clear();
		},
		onError: (error: Error, variables: void, context: { previousQueries: Map<string, { data: ICart[]; total: number; page: number; limit: number }> } | undefined) => {
			// Revert all queries to previous state
			context?.previousQueries?.forEach((data: { data: ICart[]; total: number; page: number; limit: number }, queryKey: string) => {
				queryClient.setQueryData(queryKey, data);
			});

			toast.error("Failed to clear cart", {
				description: error.message || "Please try again",
			});
		},
		onSettled: () => {
			// Invalidate all cart queries
			queryClient.invalidateQueries({ queryKey: ["cart"] });
			// Invalidate course queries to update cart status
			queryClient.invalidateQueries({ queryKey: ["courses"] });
			queryClient.invalidateQueries({ queryKey: ["course"] });
		},
	});
}
