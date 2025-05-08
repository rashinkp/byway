"use client";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { User } from "@/types/user";
import { useAddToCart } from "@/hooks/cart/useAddToCart";
import Link from "next/link";

interface CourseSidebarProps {
  course: any;
  isLoading: boolean;
  handleAddToCart: () => void
  isCartLoading: boolean;
}

export default function CourseSidebar({
  course,
  isLoading,
  handleAddToCart,
  isCartLoading
}: CourseSidebarProps) {


  if (isLoading) {
    return (
      <div className="sticky top-4 border rounded-lg overflow-hidden shadow-md">
        <Skeleton className="w-full h-48" />
        <div className="p-6">
          <Skeleton className="h-6 w-24 mb-4" />
          <Skeleton className="h-10 w-full mb-2" />
          <Skeleton className="h-10 w-full mb-6" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="sticky top-4 ">
      <div className="aspect-w-16 aspect-h-10 relative">
        <img
          src={course?.thumbnail || ""}
          alt="Course Preview"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold">${course?.offer}</span>
            <span className="text-gray-500 line-through">${course?.price}</span>
          </div>
        </div>
        <button
          onClick={handleAddToCart}
          disabled={isCartLoading}
          className={`w-full bg-blue-600 rounded-lg text-white font-medium py-3  mb-2 transition ${
            isCartLoading
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-blue-700"
          }`}
        >
          {isCartLoading ? "Adding..." : "Add To Cart"}
        </button>
        <Link
          href={`/user/checkout?courseId=${course.id}`}
          className={`w-full border rounded-lg border-gray-300 text-gray-800 font-medium py-3 transition block text-center ${
            isCartLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-50"
          }`}
        >
          Enroll Now
        </Link>
      </div>
    </div>
  );
}
