"use client";

import { useState } from "react";
import { CourseGrid } from "@/components/course/CourseGrid";
import { Pagination } from "@/components/ui/Pagination";
import ErrorDisplay from "@/components/ErrorDisplay";
import { Course } from "@/types/course";

interface MyCourse extends Course {
  rating: number;
  reviewCount: number;
  formattedDuration: string;
  lessons: number;
  bestSeller: boolean;
  thumbnail: string;
  price: number;
  progress: number;
  completedLessons: number;
  totalLessons: number;
  lastAccessed: string;
}

// Dummy data for purchased courses
const dummyPurchasedCourses: MyCourse[] = [
  {
    id: "1",
    title: "Complete JavaScript Development Bootcamp",
    description:
      "Master JavaScript from scratch and build modern web applications",
    price: 89.99,
    offer: 49.99,
    duration: 42,
    level: "BEGINNER",
    rating: 4.8,
    reviewCount: 342,
    formattedDuration: "42 hours",
    lessons: 120,
    bestSeller: true,
    thumbnail: "/assets/courses/javascript.jpg",
    progress: 65,
    completedLessons: 78,
    totalLessons: 120,
    lastAccessed: "2 days ago",
    status: "PUBLISHED",
    categoryId: "web-development",
    createdBy: "instructor-1",
    createdAt: new Date("2023-01-15"),
    updatedAt: new Date("2023-06-20"),
  },
  {
    id: "2",
    title: "React Frontend Development Masterclass",
    description:
      "Build professional React applications with modern hooks and patterns",
    price: 129.99,
    offer: 79.99,
    duration: 36,
    level: "MEDIUM",
    rating: 4.9,
    reviewCount: 218,
    formattedDuration: "36 hours",
    lessons: 95,
    bestSeller: true,
    thumbnail: "/assets/courses/react.jpg",
    progress: 30,
    completedLessons: 28,
    totalLessons: 95,
    lastAccessed: "Yesterday",
    status: "PUBLISHED",
    categoryId: "frontend",
    createdBy: "instructor-2",
    createdAt: new Date("2023-02-10"),
    updatedAt: new Date("2023-06-15"),
  },
  {
    id: "3",
    title: "Node.js Backend Development",
    description: "Create scalable backend services with Node.js and Express",
    price: 99.99,
    offer: 59.99,
    duration: 28,
    level: "MEDIUM",
    rating: 4.7,
    reviewCount: 176,
    formattedDuration: "28 hours",
    lessons: 85,
    bestSeller: false,
    thumbnail: "/assets/courses/nodejs.jpg",
    progress: 15,
    completedLessons: 13,
    totalLessons: 85,
    lastAccessed: "1 week ago",
    status: "PUBLISHED",
    categoryId: "backend",
    createdBy: "instructor-3",
    createdAt: new Date("2023-03-01"),
    updatedAt: new Date("2023-06-10"),
  },
  {
    id: "4",
    title: "Advanced TypeScript Programming",
    description: "Master TypeScript and build type-safe applications",
    price: 79.99,
    offer: null,
    duration: 22,
    level: "ADVANCED",
    rating: 4.6,
    reviewCount: 98,
    formattedDuration: "22 hours",
    lessons: 64,
    bestSeller: false,
    thumbnail: "/assets/courses/typescript.jpg",
    progress: 5,
    completedLessons: 3,
    totalLessons: 64,
    lastAccessed: "3 days ago",
    status: "PUBLISHED",
    categoryId: "programming",
    createdBy: "instructor-4",
    createdAt: new Date("2023-04-05"),
    updatedAt: new Date("2023-06-05"),
  },
  {
    id: "5",
    title: "MongoDB Database Design",
    description: "Learn how to design efficient NoSQL databases with MongoDB",
    price: 69.99,
    offer: 39.99,
    duration: 18,
    level: "MEDIUM",
    rating: 4.5,
    reviewCount: 87,
    formattedDuration: "18 hours",
    lessons: 52,
    bestSeller: false,
    thumbnail: "/assets/courses/mongodb.jpg",
    progress: 100,
    completedLessons: 52,
    totalLessons: 52,
    lastAccessed: "2 weeks ago",
    status: "PUBLISHED",
    categoryId: "database",
    createdBy: "instructor-5",
    createdAt: new Date("2023-05-01"),
    updatedAt: new Date("2023-05-30"),
  },
  {
    id: "6",
    title: "CSS Animations and Transitions",
    description:
      "Create engaging user experiences with advanced CSS animations",
    price: 49.99,
    offer: 29.99,
    duration: 12,
    level: "BEGINNER",
    rating: 4.7,
    reviewCount: 145,
    formattedDuration: "12 hours",
    lessons: 38,
    bestSeller: false,
    thumbnail: "/assets/courses/css.jpg",
    progress: 75,
    completedLessons: 28,
    totalLessons: 38,
    lastAccessed: "4 days ago",
    status: "PUBLISHED",
    categoryId: "web-development",
    createdBy: "instructor-6",
    createdAt: new Date("2023-05-15"),
    updatedAt: new Date("2023-05-25"),
  },
];

export default function MyCoursesPage() {
  const itemsPerPage = 6;
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  // Calculate pagination values
  const indexOfLastCourse = currentPage * itemsPerPage;
  const indexOfFirstCourse = indexOfLastCourse - itemsPerPage;
  const currentCourses = dummyPurchasedCourses.slice(indexOfFirstCourse, indexOfLastCourse);
  const totalPages = Math.ceil(dummyPurchasedCourses.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Simulate progress bars on course cards
  const CourseGridWithProgress = ({ courses, isLoading }: { courses: MyCourse[], isLoading: boolean }) => {
    return (
      <div className="mb-8">
        <CourseGrid courses={courses} isLoading={isLoading} />
        {courses.length === 0 && !isLoading && (
          <div className="flex flex-col items-center justify-center py-12 bg-gray-50 rounded-lg">
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No courses found</h3>
            <p className="text-gray-500">You haven't purchased any courses yet.</p>
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
            defaultValue="recent"
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
            <h2 className="text-lg font-semibold text-gray-800">Continue Learning</h2>
            <p className="text-gray-600 text-sm">Pick up where you left off</p>
          </div>
          <a href="#" className="text-blue-600 hover:text-blue-800 text-sm mt-2 md:mt-0">View All</a>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {currentCourses.slice(0, 3).map(course => (
            <div key={`continue-${course.id}`} className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
              <div className="relative h-40 bg-gray-200">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/default-thumbnail.png";
                  }}
                />
                <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white rounded-full w-12 h-12 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-800 mb-1 line-clamp-1">{course.title}</h3>
                <p className="text-sm text-gray-600 mb-2">Last accessed {course.lastAccessed}</p>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${course.progress}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-600">{course.progress}% complete • {course.completedLessons}/{course.totalLessons} lessons</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">All My Courses</h2>
        <CourseGridWithProgress courses={currentCourses} isLoading={isLoading} />
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