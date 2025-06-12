'use client'

import { CategoryCard } from "@/components/category/CategoryCard";
import { TopCourses } from "@/components/course/TopCourseList";
import { StatsCard } from "@/components/DashboardStats";
import { HeroSection } from "@/components/HeroSection";
import { TopInstructors } from "@/components/instructor/TopInstructor";
import { Atom, Code, Megaphone, Telescope } from "lucide-react";
import { useCategories } from "@/hooks/category/useCategories";
import { useRouter } from "next/navigation";
import { useGetAllCourses } from "@/hooks/course/useGetAllCourse";
import { useGetAllInstructors } from "@/hooks/instructor/useGetAllInstructor";

export default function UserDashboard() {
  const router = useRouter();
  const { data: categoriesData, isLoading: isCategoriesLoading } = useCategories({
    page: 1,
    limit: 4,
    filterBy: "Active"
  });

  const { data: coursesData, isLoading: isCoursesLoading } = useGetAllCourses({
    page: 1,
    limit: 4,
    role: "USER"
  });

  const { data: instructorsData, isLoading: isInstructorsLoading } = useGetAllInstructors({
    page: 1,
    limit: 4,
    sortBy: "createdAt",
    sortOrder: "desc",
    filterBy: "Approved",
    includeDeleted: false
  });

  const handleCategoryClick = (categoryId: string) => {
    router.push(`/courses?category=${categoryId}`);
  };

  const stats = [
    { value: "250+", description: "Courses by our best mentors" },
    { value: "1000+", description: "Courses by our best mentors" },
    { value: "15+", description: "Courses by our best mentors" },
    { value: "2400+", description: "Courses by our best mentors" },
  ];

  const categories = categoriesData?.items.map(category => ({
    id: category.id,
    name: category.name,
    courseCount: 0, // This will need to be updated when we have course count data
    icon: <Code className="w-5 h-5 text-blue-500" />, // Default icon, can be customized based on category
  })) || [];

  const topCourses = coursesData?.items.map(course => ({
    id: course.id,
    thumbnail: course.thumbnail || "/default-thumbnail.png",
    title: course.title,
    tutorName: "Instructor", // This will need to be updated when we have instructor data
    rating: course.rating || 4.5,
    reviewCount: course.reviewCount || 100,
    duration: course.duration ? `${course.duration} hours` : "Unknown",
    formattedDuration: course.duration ? `${course.duration} hours` : "Unknown",
    lessons: course.lessons || 10,
    price: course.offer || course.price || 0,
    bestSeller: course.bestSeller || false,
  })) || [];

  const topInstructors = instructorsData?.data.items.map(instructor => ({
    id: instructor.id,
    areaOfExpertise: instructor.areaOfExpertise,
    professionalExperience: instructor.professionalExperience,
    about: instructor.about || "",
    website: instructor.website || "",
    education: instructor.education || "",
    certifications: instructor.certifications || "",
    totalStudents: instructor.totalStudents,
    user: {
      ...instructor.user,
      avatar: instructor.user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(instructor.user.name)}&background=random`
    }
  })) || [];

  return (
    <div className="container mx-auto px-4 py-8">
      <HeroSection className="mb-12" />
      <StatsCard stats={stats} className="mb-8" />
      <CategoryCard 
        categories={categories} 
        className="mb-8" 
        onCategoryClick={handleCategoryClick}
      />
      <TopCourses courses={topCourses} className="mb-8" />
      <TopInstructors instructors={topInstructors} className="mb-8" />
    </div>
  );
}
