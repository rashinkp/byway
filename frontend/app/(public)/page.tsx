'use client'

import { useCategories } from "@/hooks/category/useCategories";
import { useRouter } from "next/navigation";
import { useGetAllCourses } from "@/hooks/course/useGetAllCourse";
import { useGetAllInstructors } from "@/hooks/instructor/useGetAllInstructor";
import KnowledgePluseBanner from "@/components/banners/KnowledgePluseBanner";
import { TopCourses } from "@/components/course/TopCourseList";
import { CategoriesSection } from "@/components/category/CategorySection";
import { HowItWorksSection } from "@/components/common/HowItWorksSection";
import { SectionGrid } from "@/components/common/SectionGrid";
import { InstructorCard } from "@/components/instructor/InstructorCard";

export default function UserDashboard() {
  const router = useRouter();
  const { data: categoriesData, isLoading: isCategoriesLoading } = useCategories({
    page: 1,
    limit: 4,
    filterBy: "Active"
  });

  const { data: coursesData, isLoading: isCoursesLoading } = useGetAllCourses({
    page: 1,
    limit: 10,
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


  const categories = categoriesData?.items.map(category => ({
    id: category.id,
    name: category.name,
    description: category.description || "",
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
    <div
      className="relative min-h-screen px-10"
      style={{ background: "var(--color-background)" }}
    >
      <div className="container mx-auto px-2 sm:px-4 pt-6 sm:pt-8">
        <KnowledgePluseBanner />
        <section className="w-screen relative left-1/2 right-1/2 -mx-[50vw] bg-[var(--color-surface)] rounded-2xl shadow-lg py-10 sm:py-16 my-26">
          <div className="max-w-7xl mx-auto px-4">
            <CategoriesSection
              categories={categories}
              isLoading={isCategoriesLoading}
              onCategoryClick={handleCategoryClick}
            />
          </div>
        </section>
        {/* Top Courses Section with matching alignment and spacing */}
        <section className="my-16">
          <div className="max-w-7xl mx-auto px-4">
            <TopCourses courses={topCourses} router={router} />
          </div>
        </section>
        {/* How It Works Section */}
        <section className="w-screen relative left-1/2 right-1/2 -mx-[50vw] bg-[var(--color-surface)] rounded-2xl shadow-lg py-10 sm:py-16 my-16">
          <div className="max-w-7xl mx-auto px-4">
            <HowItWorksSection />
          </div>
        </section>
        {/* Instructors Section */}
        <section className="my-16">
          <div className="max-w-7xl mx-auto px-4">
            <SectionGrid
              title={<span>Meet our professional <span className="inline-block relative">mentors.<svg className="absolute -bottom-2 left-0 w-full h-3" viewBox="0 0 120 12" fill="none"><path d="M0 10 Q60 0 120 10" stroke="var(--color-primary-dark)" strokeWidth="2" fill="none"/></svg></span></span>}
              items={topInstructors}
              renderCard={instructor => <InstructorCard instructor={instructor} />}
              showNavigation={true}
            />
          </div>
        </section>
        {/* Testimonial Section */}
        <section className="w-screen relative left-1/2 right-1/2 -mx-[50vw] bg-[var(--color-surface)] rounded-2xl shadow-lg py-10 sm:py-16">
          <div className="max-w-2xl mx-auto px-4 text-left">
            <div className="flex justify-start mb-4">
              <svg width="56" height="40" viewBox="0 0 56 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <text x="0" y="32" fontSize="56" fill="var(--color-background)" fontWeight="bold">“</text>
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-4 text-[var(--color-primary-dark)]">Testimonial</h2>
            <p className="text-lg text-[var(--color-primary-dark)] mb-8 font-medium">
              “Since implementing Byway, our organization has witnessed a remarkable transformation in how we approach learning. The platform's simplicity belies its powerful capabilities, offering a seamless and enjoyable educational experience. The efficiency with which we can now manage courses, track progress, and foster collaboration among learners is truly impressive.”
            </p>
            <div className="flex flex-col items-start gap-2">
              <span className="font-semibold text-[var(--color-primary-dark)]">Byway</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
