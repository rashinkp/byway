import { CourseGrid } from "@/components/course/CourseGrid";
import { cn } from "@/utils/cn";
import Link from "next/link";
import { Course } from "@/types/course";

interface TopCoursesProps {
  courses: Course[];
  className?: string;
  variant?: 'default' | 'compact' | 'sidebar';
}

export function TopCourses({ courses, className, variant = 'compact' }: TopCoursesProps) {
  return (
    <div className={cn(className)}>
      {/* Header removed */}

      {/* Courses Grid */}
      <CourseGrid courses={courses} variant={variant} />
    </div>
  );
}

// Example usage with dummy data
export function TopCoursesExample() {
  const courses: Course[] = [
    {
      id: "1",
      thumbnail:
        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
      title: "Beginner's Guide to Design",
      description: "Learn the fundamentals of design",
      level: "BEGINNER",
      price: 149.9,
      offer: 149.9,
      duration: 22,
      status: "PUBLISHED",
      categoryId: "1",
      createdBy: "1",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deletedAt: null,
      approvalStatus: "APPROVED",
      adminSharePercentage: 20,
      instructor: {
        id: "1",
        name: "Ronald Richards",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
      },
      reviewStats: {
        averageRating: 4.9,
        totalReviews: 1200
      },
      isEnrolled: false,
      isInCart: false,
      bestSeller: true
    },
    {
      id: "2",
      thumbnail:
        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
      title: "Advanced Web Development",
      description: "Master modern web development techniques",
      level: "ADVANCED",
      price: 199.9,
      offer: 199.9,
      duration: 30,
      status: "PUBLISHED",
      categoryId: "1",
      createdBy: "1",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deletedAt: null,
      approvalStatus: "APPROVED",
      adminSharePercentage: 20,
      instructor: {
        id: "1",
        name: "Ronald Richards",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
      },
      reviewStats: {
        averageRating: 4.8,
        totalReviews: 800
      },
      isEnrolled: false,
      isInCart: false,
      bestSeller: false
    },
    {
      id: "3",
      thumbnail:
        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
      title: "Data Science Fundamentals",
      description: "Introduction to data science and analytics",
      level: "MEDIUM",
      price: 179.9,
      offer: 179.9,
      duration: 25,
      status: "PUBLISHED",
      categoryId: "1",
      createdBy: "1",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deletedAt: null,
      approvalStatus: "APPROVED",
      adminSharePercentage: 20,
      instructor: {
        id: "1",
        name: "Ronald Richards",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
      },
      reviewStats: {
        averageRating: 4.7,
        totalReviews: 600
      },
      isEnrolled: false,
      isInCart: false,
      bestSeller: false
    },
    {
      id: "4",
      thumbnail:
        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
      title: "Mobile App Development",
      description: "Build native mobile applications",
      level: "MEDIUM",
      price: 159.9,
      offer: 159.9,
      duration: 28,
      status: "PUBLISHED",
      categoryId: "1",
      createdBy: "1",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deletedAt: null,
      approvalStatus: "APPROVED",
      adminSharePercentage: 20,
      instructor: {
        id: "1",
        name: "Ronald Richards",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
      },
      reviewStats: {
        averageRating: 4.6,
        totalReviews: 450
      },
      isEnrolled: false,
      isInCart: false,
      bestSeller: false
    },
  ];

  return <TopCourses courses={courses} />;
}
