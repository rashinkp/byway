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
    <div className="min-h-screen bg-gray-50/50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <Card className="bg-white/80 backdrop-blur-sm border border-gray-100 shadow-sm rounded-xl p-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Shopping Cart</h1>
              <p className="text-gray-600 mt-1">
                Review your selected courses before checkout
              </p>
            </div>
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              {cart?.length || 0} {cart?.length === 1 ? "Course" : "Courses"}
            </Badge>
          </div>
        </Card>

        {/* Main Content */}
        {isLoading || clearCartMutation.isPending ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card className="bg-white/80 backdrop-blur-sm border border-gray-100 shadow-sm rounded-xl overflow-hidden">
                {[...Array(3)].map((_, index) => (
                  <CartItemSkeleton key={index} />
                ))}
              </Card>
            </div>
            <div className="lg:col-span-1">
              <Card className="bg-white/80 backdrop-blur-sm border border-gray-100 shadow-sm rounded-xl p-6 sticky top-6">
                <div className="space-y-4">
                  <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 w-40 bg-gray-200 rounded animate-pulse" />
                  <div className="h-10 w-full bg-gray-200 rounded animate-pulse" />
                </div>
              </Card>
            </div>
          </div>
        ) : (cart?.length ?? 0) > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card className="bg-white/80 backdrop-blur-sm border border-gray-100 shadow-sm rounded-xl overflow-hidden">
                <div className="p-4 border-b border-gray-100">
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
              </Card>
            </div>
            <div className="lg:col-span-1">
              <Card className="bg-white/80 backdrop-blur-sm border border-gray-100 shadow-sm rounded-xl p-6 sticky top-6">
                <OrderSummary cart={cart ?? []} />
                <div className="mt-6">
                  <Link href="/user/checkout">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
                      Proceed to Checkout
                    </Button>
                  </Link>
                </div>
              </Card>
            </div>
          </div>
        ) : (
          <Card className="bg-white/80 backdrop-blur-sm border border-gray-100 shadow-sm rounded-xl p-8">
            <div className="flex flex-col items-center justify-center text-center">
              <ShoppingCart className="w-16 h-16 text-gray-300 mb-4" />
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
              <p className="text-gray-600 mb-6">Looks like you haven't added any courses to your cart yet.</p>
              <Link href="/courses">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-6">
                  Browse Courses
                </Button>
              </Link>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
