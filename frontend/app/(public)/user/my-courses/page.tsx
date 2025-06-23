"use client";

import { useState, useEffect } from "react";
import { Pagination } from "@/components/ui/Pagination";
import ErrorDisplay from "@/components/ErrorDisplay";
import { Course } from "@/types/course";
import { useGetEnrolledCourses } from "@/hooks/course/useGetEnrolledCourses";
import { motion } from "framer-motion";
import { CourseCard } from "@/components/course/CourseCard";
import Link from "next/link";
import { BookOpen } from "lucide-react";


export default function MyCoursesPage() {
  const itemsPerPage = 8;
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoaded, setIsLoaded] = useState(false);

  const { data, isLoading, error } = useGetEnrolledCourses({
    page: currentPage,
    limit: itemsPerPage,
    sortBy: "enrolledAt",
    sortOrder: "desc",
    search: "",
    level: "All",
  });

  const courses: Course[] = data?.items ?? [];

  // Calculate pagination values
  const totalPages = data?.totalPages ?? 1;

  // Handle animation loading state
  useEffect(() => {
    if (!isLoading) {
      setIsLoaded(true);
    }
  }, [isLoading]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (error) {
    return (
      <ErrorDisplay
        title="My Courses Error"
        description="Error occurred while getting your courses"
        error={error}
      />
    );
  }

  if (!isLoading && (!courses || courses.length === 0)) {
    return (
      <div className="container mx-auto px-4 py-2">
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-4 text-gray-300">
            <BookOpen className="w-full h-full" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No courses enrolled yet
          </h3>
          <p className="text-gray-600 mb-4">
            Start your learning journey by enrolling in your first course!
          </p>
          <Link 
            href="/courses" 
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Browse Courses
          </Link>
        </div>
      </div>
    );
  }

  // Animation variants for staggered appearance (from CourseGrid)
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <div className="w-full">
      {/* Header with Description */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">My Courses</h1>
        <p className="text-gray-600">
          Access all your enrolled courses here. Continue your learning journey and track your progress across all your courses.
        </p>
      </div>

      {/* Course Grid */}
      <motion.div
        className="w-full"
        variants={containerVariants}
        initial="hidden"
        animate={isLoaded ? "show" : "hidden"}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {courses.map((course) => (
            <motion.div
              key={course.id}
              className="w-full"
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.4, ease: "easeOut" },
                },
              }}
            >
              <Link href={`/courses/${course.id}`} className="block h-full">
                <CourseCard
                  course={course}
                  className="w-full h-full hover:shadow-lg transition-shadow duration-300"
                />
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8">
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
}