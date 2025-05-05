"use client";

import { useState } from "react";
import { FilterSidebar } from "@/components/FilterSidebar";
import { CourseGrid } from "@/components/course/CourseGrid";
import { Pagination } from "@/components/ui/Pagination";
import { useGetAllCourses } from "@/hooks/course/useGetAllCourse";
import ErrorDisplay from "@/components/ErrorDisplay";

interface Course {
  thumbnail: string;
  title: string;
  tutorName: string;
  rating: number;
  reviewCount: number;
  duration: string;
  lessons: number;
  price: number;
  bestSeller?: boolean;
}

export default function CourseListingPage() {
  const allCourses = [
    {
      thumbnail:
        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
      title: "Master Web Development with React and Node.js",
      tutorName: "John Doe",
      rating: 4.7,
      reviewCount: 1243,
      duration: "12h 30m",
      lessons: 45,
      price: 49.99,
      bestSeller: true,
    },
    {
      thumbnail:
        "https://images.unsplash.com/photo-1501504906304-e396f752d904?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
      title: "Introduction to Data Science with Python",
      tutorName: "Jane Smith",
      rating: 4.5,
      reviewCount: 892,
      duration: "8h 15m",
      lessons: 30,
      price: 39.99,
      bestSeller: false,
    },
    {
      thumbnail:
        "https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
      title: "UI/UX Design Fundamentals",
      tutorName: "Alex Brown",
      rating: 4.8,
      reviewCount: 567,
      duration: "6h 45m",
      lessons: 25,
      price: 29.99,
      bestSeller: false,
    },
    {
      thumbnail:
        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
      title: "Advanced JavaScript Techniques",
      tutorName: "Emily Davis",
      rating: 4.6,
      reviewCount: 789,
      duration: "10h 20m",
      lessons: 40,
      price: 59.99,
      bestSeller: true,
    },
    {
      thumbnail:
        "https://images.unsplash.com/photo-1501504906304-e396f752d904?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
      title: "Digital Marketing Mastery",
      tutorName: "Michael Lee",
      rating: 4.9,
      reviewCount: 1345,
      duration: "15h 10m",
      lessons: 60,
      price: 69.99,
      bestSeller: false,
    },
    {
      thumbnail:
        "https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
      title: "Physics for Beginners",
      tutorName: "Sarah Johnson",
      rating: 4.4,
      reviewCount: 456,
      duration: "5h 50m",
      lessons: 20,
      price: 19.99,
      bestSeller: false,
    },
    {
      thumbnail:
        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
      title: "Full-Stack Web Development",
      tutorName: "David Wilson",
      rating: 4.8,
      reviewCount: 987,
      duration: "20h 40m",
      lessons: 80,
      price: 79.99,
      bestSeller: true,
    },
    {
      thumbnail:
        "https://images.unsplash.com/photo-1501504906304-e396f752d904?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
      title: "Graphic Design Essentials",
      tutorName: "Laura Adams",
      rating: 4.3,
      reviewCount: 654,
      duration: "7h 30m",
      lessons: 35,
      price: 34.99,
      bestSeller: false,
    },
  ];

  const itemsPerPage = 6;
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredCourses, setFilteredCourses] = useState(allCourses);

  const { data: courses, isLoading, error } = useGetAllCourses();

 
  console.log(courses);

  const handleFilterChange = (filters: Record<string, any>) => {
    let updatedCourses = [...allCourses];

    if (filters.category && filters.category !== "all") {
      updatedCourses = updatedCourses.filter((course) =>
        course.title.toLowerCase().includes(filters.category)
      );
    }

    if (filters.level && filters.level !== "all") {
      updatedCourses = updatedCourses.filter((course) =>
        course.duration.toLowerCase().includes(filters.level)
      );
    }

    if (filters.price && filters.price !== "all") {
      updatedCourses = updatedCourses.filter((course) =>
        filters.price === "free" ? course.price === 0 : course.price > 0
      );
    }

    if (filters.rating && filters.rating !== "all") {
      const minRating = parseFloat(filters.rating);
      updatedCourses = updatedCourses.filter(
        (course) => course.rating >= minRating
      );
    }

    if (filters.duration && filters.duration !== "all") {
      updatedCourses = updatedCourses.filter((course) => {
        const hours = parseFloat(course.duration);
        if (filters.duration === "under 5 hours") return hours < 5;
        if (filters.duration === "5-10 hours") return hours >= 5 && hours <= 10;
        if (filters.duration === "over 10 hours") return hours > 10;
        return true;
      });
    }

    if (filters.sort) {
      updatedCourses.sort((a, b) => {
        if (filters.sort === "popularity-desc")
          return b.reviewCount - a.reviewCount;
        if (filters.sort === "popularity-asc")
          return a.reviewCount - b.reviewCount;
        if (filters.sort === "price-desc") return b.price - a.price;
        if (filters.sort === "price-asc") return a.price - b.price;
        return 0;
      });
    }

    setFilteredCourses(updatedCourses);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const paginatedCourses = filteredCourses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
        <div className="lg:w-1/4">
          <FilterSidebar onFilterChange={handleFilterChange} />
        </div>
        <div className="lg:w-3/4">
          <CourseGrid courses={paginatedCourses} isLoading={isLoading} />
          {!isLoading && (
            <Pagination
              totalPages={Math.ceil(filteredCourses.length / itemsPerPage)}
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      </div>
    </div>
  );
}
