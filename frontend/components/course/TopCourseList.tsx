
import { CourseCard } from "@/components/course/CourseCard";
import { cn } from "@/utils/cn";
import Link from "next/link";

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

interface TopCoursesProps {
  courses: Course[];
  className?: string;
}

export function TopCourses({ courses, className }: TopCoursesProps) {
  return (
    <div className={cn("p-6", className)}>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-gray-800">Top Courses</h2>
        <Link href="/courses">
          <span className="text-sm font-medium text-blue-600 hover:text-blue-700 cursor-pointer">
            See All
          </span>
        </Link>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {courses.map((course, index) => (
          <CourseCard key={index} {...course} />
        ))}
      </div>
    </div>
  );
}

// Example usage with dummy data
export function TopCoursesExample() {
  const courses = [
    {
      thumbnail:
        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
      title: "Beginner's Guide to Design",
      tutorName: "Ronald Richards",
      rating: 4.9,
      reviewCount: 1200,
      duration: "22 Total Hours",
      lessons: 155,
      price: 149.9,
      bestSeller: true,
    },
    {
      thumbnail:
        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
      title: "Beginner's Guide to Design",
      tutorName: "Ronald Richards",
      rating: 4.9,
      reviewCount: 1200,
      duration: "22 Total Hours",
      lessons: 155,
      price: 149.9,
      bestSeller: false,
    },
    {
      thumbnail:
        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
      title: "Beginner's Guide to Design",
      tutorName: "Ronald Richards",
      rating: 4.9,
      reviewCount: 1200,
      duration: "22 Total Hours",
      lessons: 155,
      price: 149.9,
      bestSeller: false,
    },
    {
      thumbnail:
        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
      title: "Beginner's Guide to Design",
      tutorName: "Ronald Richards",
      rating: 4.9,
      reviewCount: 1200,
      duration: "22 Total Hours",
      lessons: 155,
      price: 149.9,
      bestSeller: false,
    },
  ];

  return <TopCourses courses={courses} />;
}
