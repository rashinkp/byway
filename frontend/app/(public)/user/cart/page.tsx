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

interface CartPageProps {
  page?: number;
  limit?: number;
}

export default function CartPage({ page = 1, limit = 10 }: CartPageProps) {
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
    <div className="min-h-screen bg-[var(--color-surface)] p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-[var(--color-primary-dark)] rounded-lg p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-[var(--color-surface)]">
                Shopping Cart
              </h1>
              <p className="text-[var(--color-surface)]/70 mt-1">
                Review your selected courses before checkout
              </p>
            </div>
            <div className="bg-[var(--color-surface)] text-[var(--color-primary-dark)] px-3 py-1 rounded-full text-sm font-medium">
              {cart?.length || 0} {cart?.length === 1 ? "Course" : "Courses"}
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
              <div className="bg-[var(--color-surface)] rounded-lg p-6 sticky top-6 border border-[var(--color-primary-light)]/20">
                <div className="space-y-4">
                  <div className="h-6 w-32 bg-[var(--color-background)] rounded animate-pulse" />
                  <div className="h-4 w-24 bg-[var(--color-background)] rounded animate-pulse" />
                  <div className="h-4 w-40 bg-[var(--color-background)] rounded animate-pulse" />
                  <div className="h-10 w-full bg-[var(--color-background)] rounded animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        ) : (cart?.length ?? 0) > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="overflow-hidden">
                <div className="p-4 border-b border-[var(--color-primary-light)]/20 flex justify-between items-center">
                  <button
                    onClick={handleClearCart}
                    className="text-[var(--color-danger)] hover:text-[var(--color-danger)] font-medium text-sm flex items-center disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    disabled={clearCartMutation.isPending}
                  >
                    <Trash2 size={16} className="mr-2" />
                    Clear Cart
                  </button>
                </div>
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
                    <Button className="w-full bg-[var(--color-primary-light)] hover:bg-[var(--color-primary-dark)] text-[var(--color-surface)] rounded-lg py-3 font-medium">
                      Proceed to Checkout
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center py-20">
            <div className="bg-[var(--color-primary-light)]/10 p-6 rounded-full mb-6">
              <ShoppingCart className="w-16 h-16 text-[var(--color-primary-light)]" />
            </div>
            <h2 className="text-2xl font-semibold text-[var(--color-primary-dark)] mb-2">
              Your cart is empty
            </h2>
            <p className="text-[var(--color-muted)] mb-6 max-w-md">
              Looks like you haven't added any courses to your cart yet. Start
              exploring and add some courses!
            </p>
            <Link href="/courses">
              <Button className="bg-[var(--color-primary-dark)] hover:bg-[var(--color-primary-light)] text-[var(--color-surface)] rounded-lg px-8 py-3">
                Browse Courses
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
