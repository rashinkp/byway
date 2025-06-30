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
    <div className="relative min-h-screen pb-16" style={{ background: "var(--background)" }}>
      <div className="container mx-auto px-2 sm:px-4 py-6 sm:py-8">
        <HeroSection className="mb-10 sm:mb-16" />
        <section className="mb-8 sm:mb-12">
          <StatsCard stats={stats} className="mb-0 shadow-md" />
        </section>
        <section className="mb-8 sm:mb-12">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 mt-2 gap-2 sm:gap-0">
            <h2 className="text-xl sm:text-2xl font-bold" style={{ color: "var(--foreground)" }}>
              Top Categories
            </h2>
            <button
              onClick={() => router.push('/categories')}
              className="px-4 py-2 rounded-full font-medium text-sm transition w-full sm:w-auto mt-2 sm:mt-0"
              style={{ background: "var(--secondary)", color: "var(--secondary-foreground)" }}
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
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 mt-2 gap-2 sm:gap-0">
            <h2 className="text-xl sm:text-2xl font-bold" style={{ color: "var(--foreground)" }}>
              Top Courses
            </h2>
            <button
              onClick={() => router.push('/courses')}
              className="px-4 py-2 rounded-full font-medium text-sm transition w-full sm:w-auto mt-2 sm:mt-0"
              style={{ background: "var(--secondary)", color: "var(--secondary-foreground)" }}
            >
              View All
            </button>
          </div>
          <TopCourses courses={topCourses} className="mb-0" variant="compact" />
        </section>
        <section className="mb-8 sm:mb-12">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 mt-2 gap-2 sm:gap-0">
            <h2 className="text-xl sm:text-2xl font-bold" style={{ color: "var(--foreground)" }}>
              Top Instructors
            </h2>
            <button
              onClick={() => router.push('/instructors')}
              className="px-4 py-2 rounded-full font-medium text-sm transition w-full sm:w-auto mt-2 sm:mt-0"
              style={{ background: "var(--secondary)", color: "var(--secondary-foreground)" }}
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
