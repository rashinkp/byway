"use client";
import { useState, useEffect } from "react";
import { FilterSidebar } from "@/components/FilterSidebar";
import { CourseGrid } from "@/components/course/CourseGrid";
import { Pagination } from "@/components/ui/Pagination";
import ErrorDisplay from "@/components/ErrorDisplay";
import { Course, IGetAllCoursesInput } from "@/types/course";
import { useGetAllCourses } from "@/hooks/course/useGetAllCourse";
import { FilterSidebarSkeleton } from "@/components/course/FilterSidebarSkeleton";
import { useSearchParams } from "next/navigation";

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
  const searchParams = useSearchParams();
  const itemsPerPage = 20;
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

  // Update filters when URL parameters change
  useEffect(() => {
    const categoryParam = searchParams.get("category");
    if (categoryParam) {
      setFilters(prev => ({
        ...prev,
        category: categoryParam
      }));
    }
  }, [searchParams]);

  const handleFilterChange = (newFilters: Record<string, any>) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

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
    categoryId: filters.category && filters.category !== "all" ? filters.category : undefined,
  };

  const { data, isLoading, error } = useGetAllCourses(getAllCoursesInput);

  const courses: GridCourse[] =
    data?.items?.map((course: Course) => ({
      ...course,
      rating: 4.5,
      reviewCount: 100,
      formattedDuration: course.duration
        ? `${course.duration} hours`
        : "Unknown",
      lessons: course.lessons || 0,
      bestSeller: false,
      thumbnail: course.thumbnail || "/default-thumbnail.png",
      price: typeof course.offer === 'number' ? course.offer : 
             typeof course.price === 'number' ? course.price : 
             parseFloat(course.offer as string || course.price as string || '0'),
    })) || [];

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
    <div className="container mx-auto px-4 py-2">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">All Courses</h1>
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-1/5">
          {isLoading ? (
            <FilterSidebarSkeleton />
          ) : (
            <FilterSidebar 
              onFilterChange={handleFilterChange} 
              currentFilters={filters}
            />
          )}
        </div>
        <div className="lg:w-4/5">
          <CourseGrid courses={courses} isLoading={isLoading} variant="default" />
          {!isLoading && data && data.totalPages > 1 && (
            <div className="flex justify-center items-center mt-8 mb-4">
              <Pagination
                totalPages={data.totalPages}
                currentPage={currentPage}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}