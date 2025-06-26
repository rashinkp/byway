"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ICart, ICartFormData } from "@/types/cart";
import { addToCart } from "@/api/cart";
import { useCartStore } from "@/stores/cart.store";

export function useAddToCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ICartFormData) => addToCart(data),
    onMutate: async (newCartItem) => {
      await queryClient.cancelQueries({ queryKey: ["cart"] });

      // Snapshot previous data
      const previousCart = queryClient.getQueryData<{
        data: ICart[];
        total: number;
        page: number;
        limit: number;
      }>(["cart", 1, 10, false]);

      // Optimistically add new cart item
      const tempCartItem: ICart = {
        id: "temp-id",
        userId: "current-user", // Will be replaced by server
        courseId: newCartItem.courseId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        deletedAt: null,
      };
      queryClient.setQueryData(["cart", 1, 10, false], (old: any) => ({
        data: [...(old?.data || []), tempCartItem],
        total: (old?.total || 0) + 1,
        page: old?.page || 1,
        limit: old?.limit || 10,
      }));

      return { previousCart };
    },
    onSuccess: (newCartItem) => {
      // Update with real cart item data
      queryClient.setQueryData(["cart", 1, 10, false], (old: any) => ({
        data: old?.data.map((item: ICart) =>
          item.id === "temp-id" ? newCartItem : item
        ),
        total: old?.total || 0,
        page: old?.page || 1,
        limit: old?.limit || 10,
      }));
      // Increment cart count in store
      useCartStore.getState().increment();
    },
    onError: (error: any, newCartItem, context) => {
      // Revert on error
      queryClient.setQueryData(["cart", 1, 10, false], context?.previousCart);
      toast.error("Failed to add to cart", {
        description: error.message || "Please try again",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      // Invalidate course queries to update cart status
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      queryClient.invalidateQueries({ queryKey: ["course"] });
    },
  });
}
