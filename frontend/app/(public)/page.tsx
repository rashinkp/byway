'use client'

import { CategoryCard } from "@/components/category/CategoryCard";
import { TopCourses } from "@/components/course/TopCourseList";
import { StatsCard } from "@/components/DashboardStats";
import { HeroSection } from "@/components/HeroSection";
import { TopInstructors } from "@/components/instructor/TopInstructor";
import { Code, Sparkles } from "lucide-react";
import { useCategories } from "@/hooks/category/useCategories";
import { useRouter } from "next/navigation";
import { useGetAllCourses } from "@/hooks/course/useGetAllCourse";
import { useGetAllInstructors } from "@/hooks/instructor/useGetAllInstructor";
import { Skeleton } from "@/components/ui/skeleton";

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

  const topCourses = coursesData?.items || [];

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
    <div className="relative min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pb-16">
      <div className="container mx-auto px-2 sm:px-4 py-6 sm:py-8">
        <HeroSection className="mb-10 sm:mb-16" />
        <section className="mb-8 sm:mb-12">
          <StatsCard stats={stats} className="mb-0 shadow-md bg-white/80" />
        </section>
        <section className="mb-8 sm:mb-12">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-blue-500" /> Top Categories
            </h2>
            <button
              onClick={() => router.push('/categories')}
              className="px-4 py-2 rounded-full bg-blue-50 text-blue-700 hover:bg-blue-100 font-medium text-sm transition w-full sm:w-auto"
            >
              View All
            </button>
          </div>
          <CategoryCard 
            categories={categories} 
            className="mb-0" 
            onCategoryClick={handleCategoryClick}
          />
        </section>
        <section className="mb-8 sm:mb-12">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-purple-500" /> Top Courses
            </h2>
            <button
              onClick={() => router.push('/courses')}
              className="px-4 py-2 rounded-full bg-purple-50 text-purple-700 hover:bg-purple-100 font-medium text-sm transition w-full sm:w-auto"
            >
              View All
            </button>
          </div>
          <TopCourses courses={topCourses} className="mb-0" variant="compact" />
        </section>
        <section className="mb-8 sm:mb-12">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-pink-500" /> Top Instructors
            </h2>
            <button
              onClick={() => router.push('/instructors')}
              className="px-4 py-2 rounded-full bg-pink-50 text-pink-700 hover:bg-pink-100 font-medium text-sm transition w-full sm:w-auto"
            >
              View All
            </button>
          </div>
          <TopInstructors instructors={topInstructors} className="mb-0" />
        </section>
      </div>
    </div>
  );
}
