"use client";
import { cn } from "@/utils/cn";
import { useRouter } from "next/navigation";
import { Course } from "@/types/course";
import Image from "next/image";

interface CourseCardProps {
  course: Course;
  className?: string;
}

export function CourseCard({ course, className }: CourseCardProps) {
  const router = useRouter();

  const handleCardClick = () => {
    router.push(`/courses/${course.id}`);
  };

  // Calculate price display
  const originalPrice = course.price ? Number(course.price) : 0;
  const offerPrice = course.offer ? Number(course.offer) : 0;
  const hasDiscount = offerPrice > 0 && offerPrice < originalPrice;
  const discountPercentage = hasDiscount
    ? Math.round(((originalPrice - offerPrice) / originalPrice) * 100)
    : 0;

  // Format price to currency
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  return (
    <div
      className={cn(
        "rounded-2xl shadow-lg cursor-pointer overflow-hidden  bg-white dark:bg-neutral-800 text-black dark:text-white flex flex-col",
        className
      )}
      style={{ height: "400px", minHeight: "400px" }}
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
    >
      {/* Hero Image */}
      <div className="relative h-48 overflow-hidden">
        <Image
          src={course.thumbnail || "/placeHolder.jpg"}
          alt={course.title}
          className="w-full h-full object-cover"
          width={400}
          height={192}
        />
        {/* Discount Badge */}
        {hasDiscount && (
          <div className="absolute top-3 left-3 bg-[#facc15] text-black px-3 py-1 rounded-full text-xs font-bold shadow ring-1 ring-[#facc15]">
            -{discountPercentage}%
          </div>
        )}
      </div>
      {/* Content */}
      <div className="p-6 flex flex-col">
        {/* Profile Section */}
        <div className="flex items-center gap-2 mb-3">
          <Image
            src={
              (course.instructor &&
                "profileImage" in course.instructor &&
                (course.instructor as any).profileImage) ||
              "/UserProfile.jpg"
            }
            alt={course.instructor?.name || "Instructor"}
            className="w-9 h-9 rounded-full object-cover"
            width={36}
            height={36}
          />
          <div>
            <h3 className="font-medium text-sm text-black dark:text-white">
              {course.instructor?.name || "Unknown"}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {(course.instructor &&
                "role" in course.instructor &&
                (course.instructor as any).role) ||
                "Instructor"}
            </p>
          </div>
        </div>
        {/* Title */}
        <h2 className="text-xl font-bold mb-1 line-clamp-1 dark:text-white">
          {course.title}
        </h2>
        {/* Description */}
        <p className="text-sm mb-1 leading-relaxed line-clamp-2 text-neutral-600 dark:text-neutral-300">
          {course.description || "No description available."}
        </p>
        {/* Price Section */}
        <div className="flex items-center gap-2 mb-2 mt-2">
          {originalPrice > 0 ? (
            <>
              {hasDiscount ? (
                <>
                  <span className="text-lg font-bold  dark:text-[#facc15]">
                    {formatPrice(offerPrice)}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
                    {formatPrice(originalPrice)}
                  </span>
                </>
              ) : (
                <span className="text-lg font-bold  dark:text-[#facc15]">
                  {formatPrice(originalPrice)}
                </span>
              )}
            </>
          ) : (
            <span className="text-lg font-bold  dark:text-[#facc15]">Free</span>
          )}
        </div>
      </div>
    </div>
  );
}
