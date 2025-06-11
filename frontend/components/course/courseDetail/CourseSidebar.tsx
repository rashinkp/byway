"use client";
import { useRouter } from "next/navigation";
import { Course } from "@/types/course"; 
import { Button } from "@/components/ui/button";
import { Check, Lock, ShoppingCart } from "lucide-react";
import { useAuth } from "@/hooks/auth/useAuth";
import { useGetEnrolledCourses } from "@/hooks/course/useGetEnrolledCourses";
import { useCart } from "@/hooks/cart/useCart";
import CourseSidebarSkeleton from "./CourseSidebarSkeleton";

interface CourseSidebarProps {
  course: Course | undefined;
  isLoading: boolean;
  isCartLoading: boolean;
  handleAddToCart: () => void;
  isEnrolled: boolean;
}

export default function CourseSidebar({
  course,
  isLoading,
  isCartLoading,
  handleAddToCart,
  isEnrolled,
}: CourseSidebarProps) {
  const { user } = useAuth();
  const router = useRouter();
  const { data: enrolledCourses } = useGetEnrolledCourses({
    page: 1,
    limit: 10,
    sortBy: "enrolledAt",
    sortOrder: "desc",
    search: "",
    level: "All"
  });
  const { data: cart } = useCart();

  const isInCart = cart?.items.some((cartItem) => cartItem.courseId === course?.id);

  const handleEnroll = () => {
    if (course?.id) {
      router.push(`/user/checkout?courseId=${course.id}`);
    }
  };

  const formatPrice = (price: number | string | null | undefined) => {
    if (!price) return "Free";
    const numPrice = typeof price === 'number' ? price : Number(price);
    return `$${numPrice.toFixed(2)}`;
  };

  if (isLoading) {
    return <CourseSidebarSkeleton />;
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm border border-gray-100 shadow-sm rounded-xl p-6 sticky top-6">
      <div className="space-y-6">
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-gray-900">Course Price</h3>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-blue-600">
              ${course?.offer || course?.price}
            </span>
            {course?.offer && (
              <span className="text-lg text-gray-500 line-through">
                ${course?.price}
              </span>
            )}
          </div>
        </div>

        {!isEnrolled && (
          <div className="space-y-4">
            {isInCart ? (
              <Button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => router.push("/cart")}
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Go to Cart
              </Button>
            ) : (
              <Button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                onClick={handleAddToCart}
                disabled={isCartLoading}
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                {isCartLoading ? "Adding..." : "Add to Cart"}
              </Button>
            )}

            <Button
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700"
              onClick={handleEnroll}
            >
              <Lock className="w-4 h-4 mr-2" />
              Buy Now
            </Button>
          </div>
        )}

        {isEnrolled && (
          <div className="text-center text-green-600 font-medium">
            <Button
              className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white"
              onClick={() => router.push(`/user/my-courses/${course?.id}`)}
            >
              Learn Now
            </Button>
          </div>
        )}

        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">This course includes:</h4>
          <ul className="space-y-3">
            <li className="flex items-center text-gray-600">
              <Check className="w-4 h-4 mr-2 text-green-600" />
              Full lifetime access
            </li>
            <li className="flex items-center text-gray-600">
              <Check className="w-4 h-4 mr-2 text-green-600" />
              All course materials
            </li>
            <li className="flex items-center text-gray-600">
              <Check className="w-4 h-4 mr-2 text-green-600" />
              Certificate of completion
            </li>
            <li className="flex items-center text-gray-600">
              <Check className="w-4 h-4 mr-2 text-green-600" />
              Downloadable resources
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
