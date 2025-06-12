"use client";

import { cn } from "@/utils/cn";
import { CourseCard } from "@/components/course/CourseCard";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { Course } from "@/types/course";
import { CourseCardSkeleton } from "@/components/course/CourseCardSkeleton";

type GridCourse = Course & {
  rating: number;
  reviewCount: number;
  formattedDuration: string;
  lessons: number;
  bestSeller: boolean;
  thumbnail: string;
  price: number;
};

interface CourseGridProps {
  courses: GridCourse[];
  className?: string;
  isLoading?: boolean;
}

export function CourseGrid({
  courses,
  className,
  isLoading = false,
}: CourseGridProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      setIsLoaded(true);
    }
  }, [isLoading]);

  // Animation variants for staggered appearance
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
  };

  // Skeleton Card Component using shadcn/ui Skeleton
  const SkeletonCard = () => (
    <div className="flex flex-col bg-white rounded-xl border border-gray-100 shadow-sm w-full h-[450px]">
      <div className="relative h-52">
        <Skeleton className="w-full h-full rounded-t-xl" />
        <Skeleton className="absolute top-4 left-4 w-20 h-6 rounded-md" />
      </div>
      <div className="flex flex-col flex-grow p-5">
        <div className="flex items-center gap-2 mb-2">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="w-4 h-4 rounded-full" />
            ))}
          </div>
          <Skeleton className="w-12 h-4 rounded" />
        </div>
        <Skeleton className="w-3/4 h-6 rounded mb-2" />
        <Skeleton className="w-1/2 h-6 rounded mb-3" />
        <Skeleton className="w-2/3 h-4 rounded mb-4" />
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-1">
            <Skeleton className="w-4 h-4 rounded" />
            <Skeleton className="w-16 h-4 rounded" />
          </div>
          <div className="flex items-center gap-1">
            <Skeleton className="w-4 h-4 rounded" />
            <Skeleton className="w-16 h-4 rounded" />
          </div>
        </div>
        <div className="mt-auto flex items-center justify-between">
          <Skeleton className="w-12 h-6 rounded" />
          <Skeleton className="w-24 h-10 rounded-lg" />
        </div>
      </div>
    </div>
  );

  // Handle empty state
  if (!isLoading && courses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 bg-gray-50 rounded-lg border border-gray-100 shadow-sm">
        <svg
          className="w-16 h-16 text-gray-300 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <h3 className="text-lg font-medium text-gray-700 mb-2">
          No courses found
        </h3>
        <p className="text-gray-500 text-center">
          Try adjusting your filters or search criteria
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <CourseCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="absolute -top-16 -right-16 w-64 h-64 bg-blue-50 rounded-full opacity-50 blur-3xl -z-10" />
      <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-indigo-50 rounded-full opacity-50 blur-3xl -z-10" />
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Available Courses</h2>
          <p className="text-gray-500 text-sm">
            {isLoading
              ? "Loading courses..."
              : `Found ${courses.length} courses for you`}
          </p>
        </div>
        <div className="bg-white px-4 py-2 rounded-lg border border-gray-100 shadow-sm">
          <span className="text-sm text-gray-500">Showing:</span>
          <span className="text-sm font-medium text-gray-800 ml-1">
            {isLoading ? "..." : `${courses.length} courses`}
          </span>
        </div>
      </div>
      <motion.div
        className={cn(
          "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8",
          className
        )}
        variants={containerVariants}
        initial="hidden"
        animate={isLoaded ? "show" : "hidden"}
      >
        {isLoading
          ? [...Array(6)].map((_, index) => (
              <motion.div key={index} variants={itemVariants} className="flex">
                <SkeletonCard />
              </motion.div>
            ))
          : courses.map((course) => (
              <motion.div
                key={course.id}
                variants={itemVariants}
                className="flex"
              >
                  <CourseCard
                    id={course.id}
                    thumbnail={course.thumbnail}
                    title={course.title}
                    rating={course.rating}
                    reviewCount={course.reviewCount}
                    formattedDuration={course.formattedDuration}
                    lessons={course.lessons}
                    price={course.price}
                    bestSeller={course.bestSeller}
                  />
              </motion.div>
            ))}
      </motion.div>
    </div>
  );
}
