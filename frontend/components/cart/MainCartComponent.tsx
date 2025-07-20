"use client";
import { Trash2, ShoppingCart } from "lucide-react";
import { useCart } from "@/hooks/cart/useCart";
import { useRemoveFromCart } from "@/hooks/cart/useRemoveFromCart";
import { useClearCart } from "@/hooks/cart/useClearCart";
import { useCallback } from "react";
import { CartItemSkeleton } from "@/components/cart/CartSkeleton";
import { CartItems } from "@/components/cart/CartItems";
import { OrderSummary } from "@/components/cart/OrderSummery";
import ErrorDisplay from "@/components/ErrorDisplay";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function MainCartComponent() {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const limit = 10; // Assuming a default limit
  const { data, isLoading, error, refetch } = useCart({ page, limit });
  const removeFromCartMutation = useRemoveFromCart();
  const clearCartMutation = useClearCart();

  const cart = data?.items;

  const handleRemoveCourse = useCallback(
    (courseId: string) => {
      removeFromCartMutation.mutate(courseId);
    },
    [removeFromCartMutation]
  );

  const handleClearCart = useCallback(() => {
    clearCartMutation.mutate();
  }, [clearCartMutation]);

  if (error) {
    return (
      <ErrorDisplay
        error={error}
        title="Cart Error"
        description={error.message}
        onRetry={refetch}
      />
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#18181b] p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-[#facc15] dark:bg-[#18181b] rounded-lg p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-black dark:text-[#facc15]">
                Shopping Cart
              </h1>
              <p className="text-black/70 dark:text-white mt-1">
                Review your selected courses before checkout
              </p>
              </div>
            <div className="flex items-center gap-4">
            <div className="bg-white dark:bg-[#232323] text-black dark:text-white px-4 py-2 rounded-full text-sm font-medium border border-white self-center">
              {cart?.length || 0} {cart?.length === 1 ? "Course" : "Courses"}
            </div>
            <div className="p-4 flex justify-between items-center">
                  <button
                    onClick={handleClearCart}
                    className="text-red-600 hover:text-red-700 font-medium text-sm flex items-center disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    disabled={clearCartMutation.isPending}
                  >
                    Clear Cart
                  </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        {isLoading || clearCartMutation.isPending ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              {[...Array(3)].map((_, index) => (
                <CartItemSkeleton key={index} />
              ))}
            </div>
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-[#232323] rounded-lg p-6 sticky top-6 border border-[#facc15]">
                <div className="space-y-4">
                  <div className="h-6 w-32 bg-[#f9fafb] dark:bg-[#18181b] rounded animate-pulse" />
                  <div className="h-4 w-24 bg-[#f9fafb] dark:bg-[#18181b] rounded animate-pulse" />
                  <div className="h-4 w-40 bg-[#f9fafb] dark:bg-[#18181b] rounded animate-pulse" />
                  <div className="h-10 w-full bg-[#f9fafb] dark:bg-[#18181b] rounded animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        ) : (cart?.length ?? 0) > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="overflow-hidden">
              
                <div className="p-4">
                  <CartItems
                    cart={cart ?? []}
                    isRemoving={removeFromCartMutation.isPending}
                    removingCourseId={removeFromCartMutation.variables}
                    onRemoveCourse={handleRemoveCourse}
                  />
                </div>
              </div>
            </div>
            <div className="lg:col-span-1">
              <div className="sticky top-6">
                <OrderSummary cart={cart ?? []} />
                <div className="mt-6">
                  <Link href="/user/checkout">
                    <Button className="w-full bg-[#facc15]" variant={'primary'}>
                      Proceed to Checkout
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center py-20">
            <div className="bg-[#facc15]/10 p-6 rounded-full mb-6">
              <ShoppingCart className="w-16 h-16 text-[#facc15]" />
            </div>
            <h2 className="text-2xl font-semibold text-black dark:text-[#facc15] mb-2">
              Your cart is empty
            </h2>
            <p className="text-gray-500 dark:text-gray-300 mb-6 max-w-md">
              Looks like you haven't added any courses to your cart yet. Start
              exploring and add some courses!
            </p>
            <Link href="/courses">
              <Button className="bg-[#18181b] hover:bg-[#facc15] text-[#facc15] hover:text-black dark:bg-[#18181b] dark:hover:bg-[#facc15] dark:text-[#facc15] dark:hover:text-black rounded-lg px-8 py-3 border-none">
                Browse Courses
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
