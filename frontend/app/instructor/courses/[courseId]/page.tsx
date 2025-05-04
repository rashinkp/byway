"use client";

import { useParams } from "next/navigation";
import { LessonManager } from "@/components/lesson/LessonManager";
import { useGetCourseById } from "@/hooks/course/useGetCourseById";
import PlaceHolderImage from "@/public/placeHolder.jpg";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Users,
  TrendingUp,
  BookOpen,
  StarIcon,
  UserCircle,
  InfoIcon,
} from "lucide-react";
import ErrorDisplay from "@/components/ErrorDisplay";
import { CourseDetails } from "@/components/course/CourseDetails";
import { AdditionalDetailsSection } from "@/components/course/CourseAdditionalDetails";

export default function CourseDetailPage() {
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
    { id: "customers", label: "Customers", icon: UserCircle },
    { id: "details", label: "Details", icon: InfoIcon },
  ];

  return (
    <div className="container mx-auto py-4 px-4 sm:px-6 lg:px-8">
      <Tabs defaultValue="overview" className="w-full">
        <div className="relative mb-8">
          <TabsList className="flex justify-center md:justify-start gap-1 p-1 bg-gray-100 rounded-xl overflow-x-auto no-scrollbar">
            {tabItems.map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-600 rounded-lg transition-all 
                data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm
                hover:bg-gray-200 hover:text-primary"
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <TabsContent value="overview" className="mt-0">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { icon: TrendingUp, value: "$1K", label: "Lifetime Commission" },
              { icon: Users, value: "1K", label: "Students" },
              { icon: TrendingUp, value: "$800", label: "Received Commission" },
              { icon: TrendingUp, value: "$200", label: "Pending Commission" },
            ].map((stat, index) => (
              <div
                key={index}
                className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex items-center gap-3"
              >
                <div className="p-2 rounded-lg bg-primary/10">
                  <stat.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {stat.value}
                  </h3>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
          <CourseDetails
            course={course}
            isLoading={isLoading}
            src={course?.thumbnail || PlaceHolderImage}
            alt={course?.title || "Course Thumbnail"}
          />
        </TabsContent>
        <TabsContent value="lessons" className="mt-0">
          <LessonManager courseId={courseId as string} />
        </TabsContent>
        <TabsContent value="reviews" className="mt-0">
          <p className="text-gray-600">No reviews available yet.</p>
        </TabsContent>
        <TabsContent value="customers" className="mt-0">
          <p className="text-gray-600">No customer data available yet.</p>
        </TabsContent>
        <TabsContent value="details" className="mt-0">
          <AdditionalDetailsSection course={course} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
