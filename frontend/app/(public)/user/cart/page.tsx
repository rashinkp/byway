"use client";

import { useState } from "react";
import {
  ShoppingCart,
  Clock,
  BookOpen,
  Award,
  Trash2,
  ChevronRight,
} from "lucide-react";
import { ICart, Course } from "@/types/cart";
import { useCart } from "@/hooks/cart/useCart";
import { useRemoveFromCart } from "@/hooks/cart/useRemoveFromCart";
import { useClearCart } from "@/hooks/cart/useClearCart";
import { useGetCourseById } from "@/hooks/course/useGetCourseById";
import Link from "next/link";

export default function CartPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const { data, isLoading, error } = useCart({ page: 1, limit: 10 });
  const removeFromCartMutation = useRemoveFromCart();
  const clearCartMutation = useClearCart();

  // Map cart items to course details using useGetCourseById
  const courseQueries =
    data?.items?.map((item: ICart) => useGetCourseById(item.courseId)) || [];


  const handleRemoveCourse = (courseId: string) => {
    removeFromCartMutation.mutate(courseId);
  };

  const handleClearCart = () => {
    clearCartMutation.mutate();
  };

  const calculateSubtotal = (): number => {
    return courses.reduce((total, course) => total + course.price, 0);
  };

  const calculateTax = (): number => {
    return calculateSubtotal() * 0.07;
  };

  const calculateTotal = (): number => {
    return calculateSubtotal() + calculateTax();
  };

  return (
    <div className="min-h-screen pb-10">
      {/* Main Content */}
      <main className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-3xl font-bold mt-8 mb-6">Your Cart</h1>

        {isLoading || courseQueries.some((query) => query.isLoading) ? (
          <div className="bg-white p-12 rounded-lg shadow-sm text-center">
            <p>Loading...</p>
          </div>
        ) : error || courseQueries.some((query) => query.error) ? (
          <div className="bg-white p-12 rounded-lg shadow-sm text-center">
            <p className="text-red-500">
              Error: {error?.message || "Failed to load course details"}
            </p>
          </div>
        ) : courses.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                {courses.map((course) => (
                  <div
                    key={course.id}
                    className="p-6 border-b last:border-b-0 hover:bg-gray-50 relative"
                  >
                    <div className="flex">
                      <img
                        src={course.image}
                        alt={course.title}
                        className="w-32 h-20 object-cover rounded-md bg-gray-100"
                      />
                      <div className="ml-5 flex-1">
                        <h3 className="font-semibold text-lg text-gray-800">
                          {course.title}
                        </h3>
                        <p className="text-gray-500 text-sm">
                          {course.instructor}
                        </p>

                        <div className="flex items-center mt-3 text-sm text-gray-500 space-x-4">
                          <span className="flex items-center">
                            <Clock size={16} className="mr-1" />
                            {course.duration}
                          </span>
                          <span className="flex items-center">
                            <BookOpen size={16} className="mr-1" />
                            {course.lectures} lectures
                          </span>
                          <span className="flex items-center">
                            <Award size={16} className="mr-1" />
                            {course.level}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4 text-right">
                        <div className="font-bold text-lg">
                          ${course.price.toFixed(2)}
                        </div>
                        <div className="text-gray-500 line-through text-sm">
                          ${course.originalPrice.toFixed(2)}
                        </div>
                        <span className="inline-block bg-red-50 text-red-500 text-xs font-medium px-2 py-1 rounded mt-1">
                          {Math.round(
                            ((course.originalPrice - course.price) /
                              course.originalPrice) *
                              100
                          )}
                          % OFF
                        </span>
                      </div>
                      <button
                        onClick={() => handleRemoveCourse(course.id)}
                        className="absolute top-6 right-6 text-gray-400 hover:text-red-500"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
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
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md mt-6 flex items-center justify-center"
                  disabled={courses.length === 0}
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
