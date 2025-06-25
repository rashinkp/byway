"use client";

import { cn } from "@/utils/cn";
import { CourseCard } from "@/components/course/CourseCard";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { Course } from "@/types/course";

interface CourseGridProps {
  courses: Course[];
  className?: string;
  isLoading?: boolean;
  variant?: 'default' | 'compact' | 'sidebar';
}

export function CourseGrid({
  courses,
  className,
  isLoading = false,
  variant = 'default',
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

  // Grid layout based on variant
  const getGridClasses = () => {
    if (variant === 'default') {
      return "flex flex-wrap gap-4 md:gap-6 justify-start";
    }
    return "flex flex-wrap gap-4 md:gap-6 justify-center";
  };

  // Skeleton Card Component using shadcn/ui Skeleton
  const SkeletonCard = () => (
    <div className="flex flex-col bg-white rounded-xl border border-gray-100 shadow-sm w-full h-[320px]">
      <div className="relative aspect-video">
        <Skeleton className="w-full h-full rounded-t-xl" />
        <Skeleton className="absolute top-4 left-4 w-20 h-6 rounded-md" />
      </div>
      <div className="flex flex-col flex-grow p-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="w-4 h-4 rounded-full" />
            ))}
          </div>
          <Skeleton className="w-12 h-4 rounded" />
        </div>
        <Skeleton className="w-3/4 h-4 rounded mb-2" />
        <Skeleton className="w-1/2 h-3 rounded mb-3" />
        <div className="flex items-center gap-3 mb-3">
          <div className="flex items-center gap-1">
            <Skeleton className="w-3 h-3 rounded" />
            <Skeleton className="w-16 h-3 rounded" />
          </div>
          <div className="flex items-center gap-1">
            <Skeleton className="w-3 h-3 rounded" />
            <Skeleton className="w-12 h-3 rounded" />
          </div>
        </div>
        <Skeleton className="w-20 h-5 rounded mb-3" />
        <div className="mt-auto flex gap-2">
          <Skeleton className="flex-1 h-8 rounded-lg" />
          <Skeleton className="flex-1 h-8 rounded-lg" />
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
      <div className={getGridClasses()}>
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="w-80">
            <SkeletonCard />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={cn(getGridClasses(), className)}>
      {courses.map((course) => (
        <div key={course.id} className="w-80">
          <CourseCard course={course} className="w-full h-full" />
        </div>
      ))}
    </div>
  );
}
