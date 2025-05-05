"use client";

import { useState, useEffect } from "react";
import { FilterSidebar } from "@/components/FilterSidebar";
import { CourseGrid } from "@/components/course/CourseGrid";
import { Pagination } from "@/components/ui/Pagination";
import ErrorDisplay from "@/components/ErrorDisplay";
import { Course, IGetAllCoursesInput } from "@/types/course";
import { useGetAllCourses } from "@/hooks/course/useGetAllCourse";

// Define the GridCourse interface to match CourseGrid expectations
interface GridCourse extends Course {
  rating: number;
  reviewCount: number;
  formattedDuration: string;
  lessons: number;
  bestSeller: boolean;
  thumbnail: string;
  price: number;
}

export default function CourseListingPage() {
  const itemsPerPage = 6;
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<Record<string, any>>({
    search: "",
    category: "all",
    level: "all",
    price: "all",
    rating: "all",
    duration: "all",
    sort: "title-asc",
  });

  const { data, isLoading, error } = useGetAllCourses({
    page: currentPage,
    limit: itemsPerPage,
    search: filters.search || "",
    filterBy: filters.status || "All",
    sortBy: filters.sort?.includes("price")
      ? "price"
      : filters.sort?.includes("title")
      ? "title"
      : "createdAt",
    sortOrder: filters.sort?.includes("desc") ? "desc" : "asc",
    role: "USER",
  } as IGetAllCoursesInput);

  const totalPages = data?.totalPages;

  // Transform Course data to GridCourse
  const courses: GridCourse[] =
    data?.items?.map((course: Course) => ({
      ...course,
      rating: 4.5, // Placeholder: Replace with actual rating from API if available
      reviewCount: 100, // Placeholder: Replace with actual review count
      formattedDuration: course.duration
        ? `${course.duration} hours`
        : "Unknown", // Format duration
      lessons: 10, // Placeholder: Replace with actual lesson count
      bestSeller: false, // Placeholder: Set based on logic or API data
      thumbnail: course.thumbnail || "/default-thumbnail.png", // Fallback thumbnail
      price: course.price || 0, // Fallback price
    })) || [];

  const handleFilterChange = (newFilters: Record<string, any>) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page on filter change
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (error) {
    return (
      <ErrorDisplay
        title="Course Error"
        description="Error occurred while getting all courses"
        error={error}
      />
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">All Courses</h1>
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-1/5">
          <FilterSidebar onFilterChange={handleFilterChange} />
        </div>
        <div className="lg:w-4/5">
          <CourseGrid courses={courses} isLoading={isLoading} />
          {!isLoading && data && data.totalPages > 10 && (
            <Pagination
              totalPages={data.totalPages}
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      </div>
    </div>
  );
}
