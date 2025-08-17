"use client";
import { useState, useEffect } from "react";
import { FilterSidebar } from "@/components/FilterSidebar";
import { CourseGrid } from "@/components/course/CourseGrid";
import { Pagination } from "@/components/ui/Pagination";
import ErrorDisplay from "@/components/ErrorDisplay";
import { Course, GridCourse, IGetAllCoursesInput } from "@/types/course";
import { useGetAllCourses } from "@/hooks/course/useGetAllCourse";
import { useSearchParams } from "next/navigation";
import { Button } from "../ui/button";

interface CourseFilters {
  search: string;
  category: string;
  level: string;
  price: string;
  rating: string;
  duration: string;
  sort: string;
  status?: string;
}

export default function MainCourseListing() {
  const searchParams = useSearchParams();
  const itemsPerPage = 20;
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<CourseFilters>({
    search: "",
    category: "all",
    level: "all",
    price: "all",
    rating: "all",
    duration: "all",
    sort: "title-asc",
  });
  // Modal state for mobile filter
  const [filterModalOpen, setFilterModalOpen] = useState(false);

  // Update filters when URL parameters change
  useEffect(() => {
    const categoryParam = searchParams.get("category");
    if (categoryParam) {
      setFilters((prev) => ({
        ...prev,
        category: categoryParam,
      }));
    }
  }, [searchParams]);

  const handleFilterChange = (newFilters: CourseFilters) => {
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
    categoryId:
      filters.category && filters.category !== "all"
        ? filters.category
        : undefined,
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
      price:
        typeof course.offer === "number"
          ? course.offer
          : typeof course.price === "number"
          ? course.price
          : parseFloat(
              (course.offer as string) || (course.price as string) || "0"
            ),
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
    <div className="container mx-auto px-4 py-2 mt-8 ">
      {/* Mobile Filter Button */}
      <div className="block lg:hidden mb-8 mx-16">
        <Button
          className="px-4 py-2 w-full rounded-md"
          onClick={() => setFilterModalOpen(true)}
        >
          Filter and Sort
        </Button>
      </div>
      {/* Mobile Filter Modal */}
      {filterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 bg-opacity-50">
          <div className="relative w-full max-w-xs bg-white dark:bg-black rounded-lg shadow-lg p-0 overflow-y-auto max-h-screen">
            <button
              className="absolute top-2 right-2 text-2xl font-bold text-gray-700 dark:text-gray-200 hover:text-black dark:hover:text-white focus:outline-none"
              onClick={() => setFilterModalOpen(false)}
              aria-label="Close filter"
            >
              ×
            </button>
            <FilterSidebar
              onFilterChange={(f) => {
                setFilters(f);
                setCurrentPage(1);
                setFilterModalOpen(false);
              }}
              currentFilters={filters}
              isLoading={isLoading}
              onClose={() => setFilterModalOpen(false)}
            />
          </div>
        </div>
      )}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block lg:w-1/5">
          <FilterSidebar
            onFilterChange={handleFilterChange}
            currentFilters={filters}
            isLoading={isLoading}
          />
        </div>
        <div className="lg:w-4/5 flex flex-col items-center w-full">
          <CourseGrid
            courses={courses}
            isLoading={isLoading}
            variant="default"
          />
          <div className="flex justify-center items-center mt-8 mb-4">
            <Pagination
              totalPages={data?.totalPages || 1}
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
