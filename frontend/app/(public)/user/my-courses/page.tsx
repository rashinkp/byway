"use client";

import { useState, useEffect } from "react";
import { CourseGrid } from "@/components/course/CourseGrid";
import { Pagination } from "@/components/ui/Pagination";
import ErrorDisplay from "@/components/ErrorDisplay";
import { Course } from "@/types/course";
import { useGetEnrolledCourses } from "@/hooks/course/useGetEnrolledCourses";
import { motion } from "framer-motion";
import { CourseCard } from "@/components/course/CourseCard";
import Link from "next/link";

// Utility function to format duration (in minutes) to hours
const formatDuration = (duration?: number | null): string => {
  if (!duration) return "Unknown duration";
  const hours = Math.floor(duration / 60);
  const minutes = duration % 60;
  return `${hours}h ${minutes > 0 ? `${minutes}m` : ""}`;
};

// Interface for GridCourse to match CourseCard requirements
interface GridCourse extends Course {
  rating: number;
  reviewCount: number;
  formattedDuration: string;
  lessons: number;
  bestSeller: boolean;
  thumbnail: string;
  price: number;
  lastAccessed: string;
}

export default function MyCoursesPage() {
  const itemsPerPage = 6;
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<"title" | "enrolledAt" | "createdAt">(
    "enrolledAt"
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [isLoaded, setIsLoaded] = useState(false);

  // Fetch enrolled courses using the hook
  const { data, isLoading, error, refetch } = useGetEnrolledCourses({
    page: currentPage,
    limit: itemsPerPage,
    sortBy,
    sortOrder,
    search: "",
    level: "All",
  });

  // Map API courses to include UI-specific fields for CourseCard
  const courses: GridCourse[] =
    data?.items.map((course) => ({
      ...course,
      rating: course.rating ?? 4.5,
      reviewCount: course.reviewCount ?? 100,
      formattedDuration: formatDuration(course.duration),
      lessons: course.lessons ?? 50,
      bestSeller: course.bestSeller ?? false,
      thumbnail: course.thumbnail ?? "/default-thumbnail.png",
      price: course.price ?? 0,
      lastAccessed: course.lastAccessed ?? "Unknown",
    })) ?? [];

  // Calculate pagination values
  const totalPages = data?.totalPages ?? 1;
  const totalCourses = data?.total ?? 0;

  // Handle animation loading state
  useEffect(() => {
    if (!isLoading) {
      setIsLoaded(true);
    }
  }, [isLoading]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSortChange = (value: string) => {
    if (value === "recent") {
      setSortBy("enrolledAt");
      setSortOrder("desc");
    } else if (value === "progress") {
      setSortBy("enrolledAt"); // Placeholder until progress sorting is supported
      setSortOrder("desc");
    } else if (value === "title") {
      setSortBy("title");
      setSortOrder("asc");
    }
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
    <div className="container mx-auto px-4 py-2">
      {/* Header with Sorting */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">My Courses</h1>
        <div className="flex items-center">
          <span className="text-gray-600 mr-2">Sort by:</span>
          <select
            className="border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={
              sortBy === "enrolledAt" && sortOrder === "desc"
                ? "recent"
                : sortBy
            }
            onChange={(e) => handleSortChange(e.target.value)}
          >
            <option value="recent">Recently Accessed</option>
            <option value="progress">Progress</option>
            <option value="title">Course Name</option>
          </select>
        </div>
      </div>

      {/* Continue Learning Section */}
      <div className="p-4 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              Continue Learning
            </h2>
            <p className="text-gray-600 text-sm">Pick up where you left off</p>
          </div>
          <a
            href="#"
            className="text-blue-600 hover:text-blue-800 text-sm mt-2 md:mt-0"
          >
            View All
          </a>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          variants={containerVariants}
          initial="hidden"
          animate={isLoaded ? "show" : "hidden"}
        >
          {courses.slice(0, 3).map((course) => (
            <motion.div
              key={`continue-${course.id}`}
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.4, ease: "easeOut" },
                },
              }}
            >
              <Link href={`/courses/${course.id}`}>
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
                  className="w-full"
                />
              </Link>
              <p className="text-sm text-gray-600 mt-2">
                Last accessed {course.lastAccessed}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* All My Courses Section */}
      {/* <div className="mb-6">
        <CourseGrid courses={courses} isLoading={isLoading} />
      </div> */}

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}