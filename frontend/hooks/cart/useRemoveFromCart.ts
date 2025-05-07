"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ICart } from "@/types/cart";
import { removeFromCart } from "@/api/cart";

export function useRemoveFromCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (courseId: string) => removeFromCart(courseId),
    onMutate: async (courseId) => {
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
            data: data.data.filter((item: ICart) => item.courseId !== courseId),
            total: data.total - 1,
          });
        }
      });

      return { previousQueries };
    },
    onSuccess: () => {
      toast.success("Removed from Cart", {
        description: "The course has been removed from your cart.",
      });
    },
    onError: (error: any, courseId, context: any) => {
      // Revert all queries to previous state
      context?.previousQueries?.forEach((data: any, queryKey: any) => {
        queryClient.setQueryData(queryKey, data);
      });

      toast.error("Failed to remove from cart", {
        description: error.message || "Please try again",
      });
    },
    onSettled: () => {
      // Invalidate all cart queries
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
}