"use client";

import { useState } from "react";
import { FilterSidebar } from "@/components/FilterSidebar";
import { CourseGrid } from "@/components/course/CourseGrid";
import { Pagination } from "@/components/ui/Pagination";
import ErrorDisplay from "@/components/ErrorDisplay";
import { Course, IGetAllCoursesInput } from "@/types/course";
import { useGetAllCourses } from "@/hooks/course/useGetAllCourse";

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
    category: "all", // Maps to categoryId or "all"
    level: "all", // Maps to BEGINNER, MEDIUM, ADVANCED, or All
    price: "all", // Maps to All, Free, Paid
    rating: "all", // Placeholder: Not yet supported by backend
    duration: "all", // Maps to All, Under5, 5to10, Over10
    sort: "title-asc", // Maps to sortBy and sortOrder
  });

  // Map frontend filter values to backend-compatible IGetAllCoursesInput
  const getAllCoursesInput: IGetAllCoursesInput = {
    page: currentPage,
    limit: itemsPerPage,
    search: filters.search || "",
    filterBy: filters.status || "All",
    sortBy: filters.sort?.includes("price")
      ? "price"
      : filters.sort?.includes("title")
      ? "title"
      : filters.sort?.includes("createdAt")
      ? "createdAt"
      : "createdAt",
    sortOrder: filters.sort?.includes("desc") ? "desc" : "asc",
    role: "USER",
    level:
      filters.level === "beginner"
        ? "BEGINNER"
        : filters.level === "intermediate"
        ? "MEDIUM"
        : filters.level === "advanced"
        ? "ADVANCED"
        : "All",
    duration:
      filters.duration === "under 5 hours"
        ? "Under5"
        : filters.duration === "5-10 hours"
        ? "5to10"
        : filters.duration === "over 10 hours"
        ? "Over10"
        : "All",
    price:
      filters.price === "free"
        ? "Free"
        : filters.price === "paid"
        ? "Paid"
        : "All",
    // Placeholder for category: Not yet supported by backend
    // You can add categoryId here when backend supports category filtering
    // categoryId: filters.category !== "all" ? filters.category : undefined,
  };

  const { data, isLoading, error } = useGetAllCourses(getAllCoursesInput);

  const totalPages = data?.totalPages;

  const courses: GridCourse[] =
    data?.items?.map((course: Course) => ({
      ...course,
      rating: 4.5, // Placeholder: Replace with actual rating from API when available
      reviewCount: 100, // Placeholder: Replace with actual review count
      formattedDuration: course.duration
        ? `${course.duration} hours` // Assumes duration in hours; adjust if in minutes
        : "Unknown",
      lessons: 10, // Placeholder: Replace with actual lesson count
      bestSeller: false, // Placeholder: Set based on logic or API data
      thumbnail: course.thumbnail || "/default-thumbnail.png",
      price: course.offer || course.price || 0, // Use offer if available, else price
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
          {!isLoading && data && data.totalPages > 1 && (
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
