"use client";

import { clearCart } from "@/api/cart";
import { ICart } from "@/types/cart";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

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
      toast.success("Cart Cleared", {
        description: "All items have been removed from your cart.",
      });
    },
    onError: (error: any, variables, context: any) => {
      // Revert all queries to previous state
      context?.previousQueries?.forEach((data: any, queryKey: any) => {
        queryClient.setQueryData(queryKey, data);
      });

      toast.error("Failed to clear cart", {
        description: error.message || "Please try again",
      });
    },
    onSettled: () => {
      // Invalidate all cart queries
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
}
