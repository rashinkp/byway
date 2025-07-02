"use client";
import { Trash2, ShoppingCart } from "lucide-react";
import { useCart } from "@/hooks/cart/useCart";
import { useRemoveFromCart } from "@/hooks/cart/useRemoveFromCart";
import { useClearCart } from "@/hooks/cart/useClearCart";
import { useCallback } from "react";
import { CartItemSkeleton } from "@/components/cart/CartSkeleton";
import { CartItems } from "@/components/cart/CartItems";
import { OrderSummary } from "@/components/cart/OrderSummery";
import { EmptyCart } from "@/components/cart/EmptyCart";
import ErrorDisplay from "@/components/ErrorDisplay";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
      <ErrorDisplay error={error} title="Cart Error" description={error.message} onRetry={refetch}/>
    )
  }

  return (
    <div className="min-h-screen bg-[var(--color-background)] p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <Card className="bg-[var(--color-primary-dark)] backdrop-blur-sm  shadow-sm rounded-xl p-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-[var(--color-surface)]">Shopping Cart</h1>
              <p className="text-[var(--color-muted)] mt-1">
                Review your selected courses before checkout
              </p>
            </div>
            <Badge variant="outline" className="bg-[var(--color-surface)] text-[var(--color-primary-light)] border-[var(--color-border)]">
              {cart?.length || 0} {cart?.length === 1 ? "Course" : "Courses"}
            </Badge>
          </div>
        </Card>

        {/* Main Content */}
        {isLoading || clearCartMutation.isPending ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card className="bg-[var(--color-surface)] backdrop-blur-sm border border-[var(--color-border)] shadow-sm rounded-xl overflow-hidden">
                {[...Array(3)].map((_, index) => (
                  <CartItemSkeleton key={index} />
                ))}
              </Card>
            </div>
            <div className="lg:col-span-1">
              <Card className="bg-[var(--color-surface)] backdrop-blur-sm border border-[var(--color-border)] shadow-sm rounded-xl p-6 sticky top-6">
                <div className="space-y-4">
                  <div className="h-6 w-32 bg-[var(--color-muted)] rounded animate-pulse" />
                  <div className="h-4 w-24 bg-[var(--color-muted)] rounded animate-pulse" />
                  <div className="h-4 w-40 bg-[var(--color-muted)] rounded animate-pulse" />
                  <div className="h-10 w-full bg-[var(--color-muted)] rounded animate-pulse" />
                </div>
              </Card>
            </div>
          </div>
        ) : (cart?.length ?? 0) > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card className="bg-[var(--color-surface)] backdrop-blur-sm border border-[var(--color-border)] shadow-sm rounded-xl overflow-hidden">
                <div className="p-4 border-b border-[var(--color-border)]">
                  <button
                    onClick={handleClearCart}
                    className="text-[var(--color-danger)]/20 hover:text-[var(--color-danger)] font-medium text-sm flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
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
              </Card>
            </div>
            <div className="lg:col-span-1">
              <Card className="bg-[var(--color-surface)] backdrop-blur-sm border border-[var(--color-border)] shadow-sm rounded-xl p-6 sticky top-6">
                <OrderSummary cart={cart ?? []} />
                <div className="mt-6">
                  <Link href="/user/checkout">
                    <Button className="w-full bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-[var(--color-primary-foreground)] rounded-lg">
                      Proceed to Checkout
                    </Button>
                  </Link>
                </div>
              </Card>
            </div>
          </div>
        ) : (
            <div className="flex flex-col mt-40 items-center justify-center text-center">
              <ShoppingCart className="w-16 h-16 text-[var(--color-primary-light)] mb-4" />
              <h2 className="text-2xl font-semibold text-[var(--color-primary-dark)] mb-2">Your cart is empty</h2>
              <p className="text-[var(--color-muted)] mb-6">Looks like you haven't added any courses to your cart yet.</p>
              <Link href="/courses">
                <Button className="bg-[var(--color-primary-dark)] hover:bg-[var(--color-primary-light)] text-[var(--color-surface)] rounded-lg px-6">
                  Browse Courses
                </Button>
              </Link>
            </div>
        )}
      </div>
    </div>
  );
}
