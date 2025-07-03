"use client";
import { useRouter } from "next/navigation";
import { Course } from "@/types/course";
import { Button } from "@/components/ui/button";
import { Check, Lock, ShoppingCart, Star, Users } from "lucide-react";
import CourseSidebarSkeleton from "./CourseSidebarSkeleton";
import { ReactNode } from "react";

interface CourseSidebarProps {
  course: Course | undefined;
  isLoading: boolean;
  isCartLoading?: boolean;
  handleAddToCart?: () => void;
  isEnrolled?: boolean;
  adminActions?: ReactNode;
  instructorActions?: ReactNode;
  userRole?: "USER" | "ADMIN" | "INSTRUCTOR";
}

export default function CourseSidebar({
  course,
  isLoading,
  isCartLoading,
  handleAddToCart,
  isEnrolled = false,
  adminActions,
  instructorActions,
  userRole = "USER",
}: CourseSidebarProps) {
  const router = useRouter();

  const handleEnroll = () => {
    if (course?.id) {
      router.push(`/user/checkout?courseId=${course.id}`);
    }
  };

  const handleGoToCart = () => {
    router.push('/user/cart');
  };

  const formatPrice = (price: number | string | null | undefined) => {
    if (!price) return "Free";
    const numPrice = typeof price === "number" ? price : Number(price);
    return `$${numPrice.toFixed(2)}`;
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-3 h-3 ${
          i < rating ? "text-yellow-400 fill-current" : "text-gray-300"
        }`}
      />
    ));
  };

  if (isLoading) {
    return <CourseSidebarSkeleton />;
  }

  return (
    <div className="bg-[var(--color-surface)] border border-[var(--color-primary-light)]/20 shadow-sm rounded-xl p-6 sticky top-6">
      <div className="space-y-6">
        {/* Admin Actions */}
        {adminActions && (
          <div className="space-y-3">
            <h4 className="font-medium text-[var(--color-primary-dark)]">Admin Actions</h4>
            {adminActions}
          </div>
        )}

        {/* Instructor Actions */}
        {instructorActions && (
          <div className="space-y-3">
            <h4 className="font-medium text-[var(--color-primary-dark)]">Instructor Actions</h4>
            {instructorActions}
          </div>
        )}

        {/* Review Stats */}
        {course?.reviewStats && course.reviewStats.totalReviews > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium text-[var(--color-primary-dark)]">Student Reviews</h4>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                {renderStars(course.reviewStats.averageRating)}
              </div>
              <span className="text-sm font-medium text-[var(--color-primary-dark)]">
                {course.reviewStats.averageRating.toFixed(1)}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-[var(--color-muted)]">
              <Users className="w-4 h-4" />
              <span>
                {course.reviewStats.totalReviews} {course.reviewStats.totalReviews === 1 ? 'student' : 'students'} enrolled
              </span>
            </div>
          </div>
        )}

        {/* Course Price - Only show for public users */}
        {userRole === "USER" && !adminActions && !instructorActions && (
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-[var(--color-primary-dark)]">Course Price</h3>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-[var(--color-primary-light)]">
                {formatPrice(course?.offer || course?.price)}
              </span>
              {course?.offer && course?.price && (
                <span className="text-lg text-[var(--color-muted)] line-through">
                  {formatPrice(course?.price)}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons - Only show for public users */}
        {userRole === "USER" && !adminActions && !instructorActions && (
          <>
            {isEnrolled ? (
              <div className="text-center text-[var(--color-primary-light)] font-medium">
                <Button
                  className="w-full mt-4 bg-[var(--color-primary-light)] hover:bg-[var(--color-primary-dark)] text-[var(--color-surface)]"
                  onClick={() => router.push(`/user/my-courses/${course?.id}`)}
                >
                  Learn Now
                </Button>
              </div>
            ) : course?.isInCart ? (
              <div className="space-y-4">
                <Button
                  className="w-full bg-[var(--color-primary-light)] hover:bg-[var(--color-primary-dark)] text-[var(--color-surface)]"
                  onClick={handleGoToCart}
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Go to Cart
                </Button>

                <Button
                  className="w-full bg-[var(--color-background)] hover:bg-[var(--color-primary-light)]/10 text-[var(--color-primary-dark)]"
                  onClick={handleEnroll}
                >
                  <Lock className="w-4 h-4 mr-2" />
                  Buy Now
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <Button
                  className="w-full bg-[var(--color-primary-light)] hover:bg-[var(--color-primary-dark)] text-[var(--color-surface)]"
                  onClick={handleAddToCart}
                  disabled={isCartLoading}
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  {isCartLoading ? "Adding..." : "Add to Cart"}
                </Button>

                <Button
                  className="w-full bg-[var(--color-background)] hover:bg-[var(--color-primary-light)]/10 text-[var(--color-primary-dark)]"
                  onClick={handleEnroll}
                >
                  <Lock className="w-4 h-4 mr-2" />
                  Buy Now
                </Button>
              </div>
            )}
          </>
        )}

        {/* Course Features - Only show for public users */}
        {userRole === "USER" && !adminActions && !instructorActions && (
          <div className="space-y-4">
            <h4 className="font-medium text-[var(--color-primary-dark)]">This course includes:</h4>
            <ul className="space-y-3">
              <li className="flex items-center text-[var(--color-muted)]">
                <Check className="w-4 h-4 mr-2 text-[var(--color-primary-light)]" />
                Full lifetime access
              </li>
              <li className="flex items-center text-[var(--color-muted)]">
                <Check className="w-4 h-4 mr-2 text-[var(--color-primary-light)]" />
                All course materials
              </li>
              <li className="flex items-center text-[var(--color-muted)]">
                <Check className="w-4 h-4 mr-2 text-[var(--color-primary-light)]" />
                Certificate of completion
              </li>
              <li className="flex items-center text-[var(--color-muted)]">
                <Check className="w-4 h-4 mr-2 text-[var(--color-primary-light)]" />
                Downloadable resources
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
