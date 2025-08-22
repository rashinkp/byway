"use client";

import { useParams } from "next/navigation";
import { LessonManager } from "@/components/lesson/LessonManager";
import { useGetCourseById } from "@/hooks/course/useGetCourseById";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Users,
  TrendingUp,
  BookOpen,
  StarIcon,
  InfoIcon,
  DollarSign,
  Percent,
} from "lucide-react";
import ErrorDisplay from "@/components/ErrorDisplay";
import { CourseDetails } from "@/components/course/CourseDetails";
import { AdditionalDetailsSection } from "@/components/course/CourseAdditionalDetails";
import CourseReviews from "@/components/review/CourseReviews";

export default function MainCourseDetails() {
  const { courseId } = useParams();
  const {
    data: course,
    isLoading,
    error,
    refetch,
  } = useGetCourseById(courseId as string);

  if (error) {
    return (
      <ErrorDisplay
        title="Course Error"
        description="Course error occurred. Please try again"
        error={error}
        onRetry={() => refetch()}
      />
    );
  }

  const tabItems = [
    { id: "overview", label: "Overview", icon: InfoIcon },
    { id: "lessons", label: "Lessons", icon: BookOpen },
    { id: "reviews", label: "Reviews", icon: StarIcon },
    { id: "details", label: "Details", icon: InfoIcon },
  ];

  return (
    <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
      {/* Course Stats Section */}
      <div className="shadow-sm rounded-xl p-6 mb-6">
        <h3 className="text-sm font-semibold text-black dark:text-[#facc15] mb-4">
          Course Performance
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#facc15]/10">
              <Percent className="h-4 w-4 text-[#facc15]" />
            </div>
            <div>
              <p className="text-sm font-medium text-black dark:text-[#facc15]">
                {course?.instructorSharePercentage || 0}%
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-300">Your Share</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#facc15]/10">
              <Users className="h-4 w-4 text-[#facc15]" />
            </div>
            <div>
              <p className="text-sm font-medium text-black dark:text-[#facc15]">
                {course?.adminSharePercentage || 0}%
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-300">Admin Share</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#facc15]/10">
              <DollarSign className="h-4 w-4 text-[#facc15]" />
            </div>
            <div>
              <p className="text-sm font-medium text-black dark:text-[#facc15]">
                ${Number(course?.price)?.toFixed(2) || "0.00"}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-300">Course Price</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#facc15]/10">
              <TrendingUp className="h-4 w-4 text-[#facc15]" />
            </div>
            <div>
              <p className="text-sm font-medium text-black dark:text-[#facc15]">
                ${Number(course?.offer)?.toFixed(2) || "0.00"}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-300">Offer Price</p>
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <div className="relative mb-6">
          <div className="relative overflow-x-auto no-scrollbar -mx-1 px-1">
            <TabsList className="inline-flex min-w-max whitespace-nowrap gap-1 p-1 bg-[#f9fafb] dark:bg-[#232323] rounded-xl border border-[#facc15] scroll-smooth">
              {tabItems.map((tab) => (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-black dark:text-white rounded-lg transition-all data-[state=active]:bg-[#facc15] data-[state=active]:text-black data-[state=active]:shadow-sm hover:bg-[#facc15]/20 hover:text-black dark:hover:text-[#facc15]"
                >
                  <tab.icon className="h-4 w-4" />
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
            {/* Right gradient fade as scroll cue */}
            <div className="pointer-events-none absolute right-0 top-0 h-full w-8 bg-gradient-to-l from-[#f9fafb] dark:from-[#232323] to-transparent" />
          </div>
        </div>

        <TabsContent value="overview" className="mt-0">
          <CourseDetails
            course={course}
            isLoading={isLoading}
            src={course?.thumbnail || "/placeHolder.jpg"}
            alt={course?.title || "Course Thumbnail"}
          />
        </TabsContent>
        <TabsContent value="lessons" className="mt-0">
          <LessonManager courseId={courseId as string} />
        </TabsContent>
        <TabsContent value="reviews" className="mt-0">
          <div className="shadow-sm rounded-xl p-6">
            <CourseReviews
              course={course}
              isLoading={isLoading}
              userRole="INSTRUCTOR"
            />
          </div>
        </TabsContent>
        <TabsContent value="details" className="mt-0">
          <AdditionalDetailsSection course={course} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
