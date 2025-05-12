"use client";

import { useState } from "react";
import { CourseGrid } from "@/components/course/CourseGrid";
import { Pagination } from "@/components/ui/Pagination";
import ErrorDisplay from "@/components/ErrorDisplay";
import { Course } from "@/types/course";
import { useGetEnrolledCourses } from "@/hooks/course/useGetEnrolledCourses";

// Utility function to format duration (in minutes) to hours
const formatDuration = (duration?: number | null): string => {
  if (!duration) return "Unknown duration";
  const hours = Math.floor(duration / 60);
  const minutes = duration % 60;
  return `${hours}h ${minutes > 0 ? `${minutes}m` : ""}`;
};

export default function MyCoursesPage() {
  const itemsPerPage = 6;
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<"title" | "enrolledAt" | "createdAt">(
    "enrolledAt"
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Fetch enrolled courses using the hook
  const { data, isLoading, error, refetch } = useGetEnrolledCourses({
    page: currentPage,
    limit: itemsPerPage,
    sortBy,
    sortOrder,
    search: "", 
    level: "All",
  });

  // Map API courses to include UI-specific fields, ensuring GridCourse compatibility
  const courses: Course[] =
    data?.items.map((course) => ({
      ...course,
      rating: course.rating ?? 4.5, // Default rating
      reviewCount: course.reviewCount ?? 100, // Default review count
      formattedDuration: formatDuration(course.duration), // Non-optional
      lessons: course.lessons ?? 50, // Default lesson count
      bestSeller: course.bestSeller ?? false, // Default bestseller status
      progress: course.progress ?? 0, // Default progress
      completedLessons: course.completedLessons ?? 0, // Default completed lessons
      totalLessons: course.totalLessons ?? 50, // Default total lessons
      lastAccessed: course.lastAccessed ?? "Unknown", // Default last accessed
      thumbnail: course.thumbnail ?? "/default-thumbnail.png", // Non-optional fallback
      price: course.price ?? 0, // Non-optional fallback
    })) ?? [];

  // Calculate pagination values
  const totalPages = data?.totalPages ?? 1;
  const totalCourses = data?.total ?? 0;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSortChange = (value: string) => {
    if (value === "recent") {
      setSortBy("enrolledAt");
      setSortOrder("desc");
    } else if (value === "progress") {
      setSortBy("enrolledAt"); // Replace with actual progress sorting when available
      setSortOrder("desc");
    } else if (value === "title") {
      setSortBy("title");
      setSortOrder("asc");
    }
  };

  // Component to render course grid with progress
  const CourseGridWithProgress = ({
    courses,
    isLoading,
  }: {
    courses: Course[];
    isLoading: boolean;
  }) => {
    const gridCourses = courses.map((course) => ({
      ...course,
      id: course.id,
      title: course.title,
      rating: course.rating || 0,
      reviewCount: course.reviewCount || 0,
      formattedDuration: course.formattedDuration || "",
      lessons: course.lessons || 0,
      bestSeller: course.bestSeller || false,
      thumbnail: course.thumbnail || "",
      price: course.price || 0,
      level: course.level || "Beginner",
      status: course.status || "published",
      categoryId: course.categoryId || "",
      createdBy: course.createdBy || "",
    }));

    return (
      <div className="mb-8">
        <CourseGrid courses={gridCourses} isLoading={isLoading} />
        {courses.length === 0 && !isLoading && (
          <div className="flex flex-col items-center justify-center py-12 bg-gray-50 rounded-lg">
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No courses found
            </h3>
            <p className="text-gray-500">
              You haven't enrolled in any courses yet.
            </p>
          </div>
        )}
      </div>
    );
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">My Courses</h1>
        <div className="flex items-center">
          <span className="text-gray-600 mr-2">Sort by:</span>
          <select
            className="bg-white border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
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

      <div className="bg-white rounded-lg shadow-sm p-4 mb-8">
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.slice(0, 3).map((course) => (
            <div
              key={`continue-${course.id}`}
              className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="relative h-40 bg-gray-200">
                <img
                  src={course?.thumbnail || undefined}
                  alt={course.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/default-thumbnail.png";
                  }}
                />
                <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white rounded-full w-12 h-12 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                      />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-800 mb-1 line-clamp-1">
                  {course.title}
                </h3>
                <p className="text-sm text-gray-600 mb-2">
                  Last accessed {course.lastAccessed}
                </p>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${course.progress}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-600">
                  {course.progress}% complete • {course.completedLessons}/
                  {course.totalLessons} lessons
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          All My Courses
        </h2>
        <CourseGridWithProgress courses={courses} isLoading={isLoading} />
      </div>

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
