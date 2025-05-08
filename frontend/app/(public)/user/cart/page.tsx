"use client";
import {
  ShoppingCart,
  Clock,
  BookOpen,
  Award,
  Trash2,
  ChevronRight,
} from "lucide-react";
import { useCart } from "@/hooks/cart/useCart";
import { useRemoveFromCart } from "@/hooks/cart/useRemoveFromCart";
import { useClearCart } from "@/hooks/cart/useClearCart";
import Link from "next/link";

export default function CartPage() {
  const { data, isLoading, error } = useCart({ page: 1, limit: 10 });
  const removeFromCartMutation = useRemoveFromCart();
  const clearCartMutation = useClearCart();

  const cart = data?.items;

  const handleRemoveCourse = (courseId: string) => {
    removeFromCartMutation.mutate(courseId);
  };

  const handleClearCart = () => {
    clearCartMutation.mutate();
  };

  const calculateSubtotal = (): number => {
    return (
      cart?.reduce(
        (total, cart) =>
          total +
          (typeof cart?.course?.offer === "string"
            ? parseFloat(cart.course.offer)
            : typeof cart?.course?.offer === "number"
            ? cart.course.offer
            : 0),
        0
      ) ?? 0
    );
  };

  const calculateTax = (): number => {
    return calculateSubtotal() * 0.07;
  };

  const calculateTotal = (): number => {
    return calculateSubtotal() + calculateTax();
  };

  // Skeleton component for loading state
  const CartItemSkeleton = () => (
    <div className="p-6 border-b flex items-start animate-pulse">
      <div className="w-32 h-20 bg-gray-200 rounded-md flex-shrink-0"></div>
      <div className="ml-5 flex-1">
        <div className="flex justify-between items-start">
          <div>
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
          <div className="h-5 w-5 bg-gray-200 rounded-full"></div>
        </div>
        <div className="flex items-center mt-3 space-x-4">
          <div className="h-4 bg-gray-200 rounded w-20"></div>
          <div className="h-4 bg-gray-200 rounded w-20"></div>
          <div className="h-4 bg-gray-200 rounded w-20"></div>
        </div>
        <div className="mt-3 text-right">
          <div className="h-6 bg-gray-200 rounded w-16 ml-auto mb-1"></div>
          <div className="h-4 bg-gray-200 rounded w-12 ml-auto mb-1"></div>
          <div className="h-4 bg-gray-200 rounded w-10 ml-auto"></div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen pb-10">
      {/* Main Content */}
      <main className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-3xl font-bold mt-8 mb-6">Your Cart</h1>

        {isLoading || clearCartMutation.isPending ? (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            {/* Show skeletons during initial load or clear cart */}
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
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                {/* Clear Cart Button */}
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
                {cart?.map((cart) => (
                  <div
                    key={cart.id}
                    className="p-6 border-b last:border-b-0 hover:bg-gray-50 flex items-start"
                  >
                    {removeFromCartMutation.isPending &&
                    removeFromCartMutation.variables === cart.courseId ? (
                      <CartItemSkeleton />
                    ) : (
                      <>
                        <img
                          src={cart?.course?.thumbnail}
                          alt={cart.id}
                          className="w-32 h-20 object-cover rounded-md bg-gray-100 flex-shrink-0"
                        />
                        <div className="ml-5 flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-semibold text-lg text-gray-800">
                                {cart.course?.title}
                              </h3>
                              <p className="text-gray-500 text-sm">
                                {cart.course?.creator?.name}
                              </p>
                            </div>
                            <button
                              onClick={() =>
                                cart.course?.id &&
                                handleRemoveCourse(cart.course.id)
                              }
                              className="text-gray-400 hover:text-red-500 flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Remove from cart"
                              disabled={removeFromCartMutation.isPending}
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                          <div className="flex items-center mt-3 text-sm text-gray-500 space-x-4">
                            <span className="flex items-center">
                              <Clock size={16} className="mr-1" />
                              {cart.course?.duration}
                            </span>
                            <span className="flex items-center">
                              <BookOpen size={16} className="mr-1" />
                              {20} lectures
                            </span>
                            <span className="flex items-center">
                              <Award size={16} className="mr-1" />
                              {cart.course?.level}
                            </span>
                          </div>
                          <div className="mt-3 text-right">
                            <div className="font-bold text-lg">
                              $
                              {Number(
                                typeof cart.course?.offer === "string"
                                  ? parseFloat(cart.course.offer)
                                  : typeof cart.course?.offer === "number"
                                  ? cart.course.offer
                                  : cart.course?.price ?? 0
                              ).toFixed(2)}
                            </div>
                            <div className="text-gray-500 line-through text-sm">
                              $
                              {(typeof cart.course?.price === "string"
                                ? parseFloat(cart.course.price)
                                : typeof cart.course?.price === "number"
                                ? cart.course.price
                                : 0
                              ).toFixed(2)}
                            </div>
                            <span className="inline-block bg-red-50 text-red-500 text-xs font-medium px-2 py-1 rounded mt-1">
                              {Math.round(
                                (((typeof cart.course?.price === "string"
                                  ? parseFloat(cart.course.price)
                                  : typeof cart.course?.price === "number"
                                  ? cart.course.price
                                  : 0) -
                                  (typeof cart.course?.offer === "string"
                                    ? parseFloat(cart.course.offer)
                                    : typeof cart.course?.offer === "number"
                                    ? cart.course.offer
                                    : 0)) /
                                  (typeof cart.course?.price === "string"
                                    ? parseFloat(cart.course.price)
                                    : typeof cart.course?.price === "number"
                                    ? cart.course.price
                                    : 1)) *
                                  100
                              )}
                              % OFF
                            </span>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
                <h2 className="text-xl font-semibold pb-4 border-b mb-4">
                  Order Summary
                </h2>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span>${calculateSubtotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax (7%)</span>
                    <span>${calculateTax().toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex justify-between font-bold text-lg pt-4 border-t mt-4">
                  <span>Total</span>
                  <span>${calculateTotal().toFixed(2)}</span>
                </div>

                <button
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md mt-6 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={
                    cart?.length === 0 ||
                    clearCartMutation.isPending ||
                    removeFromCartMutation.isPending
                  }
                >
                  Proceed to Checkout
                  <ChevronRight size={18} className="ml-1" />
                </button>

                <div className="mt-6 text-center text-sm text-gray-500">
                  <p>
                    Need help?{" "}
                    <a href="#" className="text-blue-600 hover:underline">
                      Contact Support
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white p-12 rounded-lg shadow-sm text-center">
            <div className="flex justify-center mb-4">
              <ShoppingCart size={64} className="text-gray-300" />
            </div>
            <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
            <p className="text-gray-500 mb-6">
              Browse our courses and find something to learn today!
            </p>
            <Link
              href="/courses"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-md"
            >
              Explore Courses
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
