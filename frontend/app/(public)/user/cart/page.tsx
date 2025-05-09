"use client";
import { Trash2 } from "lucide-react";
import { useCart } from "@/hooks/cart/useCart";
import { useRemoveFromCart } from "@/hooks/cart/useRemoveFromCart";
import { useClearCart } from "@/hooks/cart/useClearCart";
import { useCallback } from "react";
import { CartItemSkeleton } from "@/components/cart/CartSkeleton";
import { CartItems } from "@/components/cart/CartItems";
import { OrderSummary } from "@/components/cart/OrderSummery";
import { EmptyCart } from "@/components/cart/EmptyCart";

interface CartPageProps {
  page?: number;
  limit?: number;
}

export default function CartPage({ page = 1, limit = 10 }: CartPageProps) {
  const { data, isLoading, error } = useCart({ page, limit });
  const removeFromCartMutation = useRemoveFromCart();
  const clearCartMutation = useClearCart();

  const cart = data?.items;

  console.log(cart);


  const handleRemoveCourse = useCallback(
    (courseId: string) => {
      removeFromCartMutation.mutate(courseId);
    },
    [removeFromCartMutation]
  );

  const handleClearCart = useCallback(() => {
    clearCartMutation.mutate();
  }, [clearCartMutation]);

  return (
    <div className="min-h-screen pb-10">
      <main className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-3xl font-bold mt-8 mb-6">Your Cart</h1>

        {isLoading || clearCartMutation.isPending ? (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            {[...Array(3)].map((_, index) => (
              <CartItemSkeleton key={index} />
            ))}
          </div>
        ) : error ? (
          <div className="bg-white p-12 rounded-lg shadow-sm text-center">
            <p className="text-red-500">
              Error: {error.message || "Failed to load cart"}
            </p>
          </div>
        ) : (cart?.length ?? 0) > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="p-4 border-b">
                  <button
                    onClick={handleClearCart}
                    className="text-red-500 hover:text-red-600 font-medium text-sm flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={clearCartMutation.isPending}
                  >
                    <Trash2 size={16} className="mr-1" />
                    Clear Cart
                  </button>
                </div>
                <CartItems
                  cart={cart ?? []}
                  isRemoving={removeFromCartMutation.isPending}
                  removingCourseId={removeFromCartMutation.variables}
                  onRemoveCourse={handleRemoveCourse}
                />
              </div>
            </div>
            <OrderSummary cart={cart ?? []} />
          </div>
        ) : (
          <EmptyCart />
        )}
      </main>
    </div>
  );
}
