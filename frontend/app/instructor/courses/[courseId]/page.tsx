"use client";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LessonManager } from "@/components/lesson/LessonManager";
import { useGetCourseById } from "@/hooks/course/useGetCourseById";
import PlaceHolderImage from "@/public/placeHolder.jpg";
import { CourseDetails } from "@/components/course/CourseDetails";
import {  useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {  FileEdit, Loader2, Users,  TrendingUp } from "lucide-react";
import ErrorDisplay from "@/components/ErrorDisplay";

export default function CourseDetailPage() {
  const { courseId } = useParams();
  const router = useRouter();
  const {
    data: course,
    isLoading,
    error,
    refetch
  } = useGetCourseById(courseId as string);
  

  const fileInputRef = useRef<HTMLInputElement>(null);


 

 

  if (error) {
    return (
      <ErrorDisplay
        title="Course Error"
        description="Course error occured. Please try again"
        error={error}
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <div className="container mx-auto py-4 px-4 sm:px-6 lg:px-8">
      {/* Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <div className="border-b mb-6">
          <TabsList className="w-full justify-start bg-transparent">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="review"
              className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none"
            >
              Review
            </TabsTrigger>
            <TabsTrigger
              value="customer"
              className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none"
            >
              Customer
            </TabsTrigger>
            <TabsTrigger
              value="lessons"
              className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none"
            >
              Lessons
            </TabsTrigger>
            <TabsTrigger
              value="details"
              className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none"
            >
              Detail
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="overview" className="mt-0">
          {/* Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-500" />
                <h3 className="text-lg font-bold text-gray-900">$1K</h3>
              </div>
              <p className="text-sm text-gray-500 mt-1">Lifetime Courses Commission</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-green-500" />
                <h3 className="text-lg font-bold text-gray-900">1K</h3>
              </div>
              <p className="text-sm text-gray-500 mt-1">Students</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-500" />
                <h3 className="text-lg font-bold text-gray-900">$800.0</h3>
              </div>
              <p className="text-sm text-gray-500 mt-1">Lifetime Received Commission</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-500" />
                <h3 className="text-lg font-bold text-gray-900">$200.00</h3>
              </div>
              <p className="text-sm text-gray-500 mt-1">Lifetime Pending Commission</p>
            </div>
          </div>

          <CourseDetails
            course={course}
            isLoading={isLoading}
            src={course?.thumbnail||PlaceHolderImage}
            alt={course?.title || "Course Thumbnail"}
          />
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            className="hidden"
            aria-label="Upload course thumbnail"
          />
        </TabsContent>

        <TabsContent value="review" className="mt-0">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Reviews</h2>
            <p className="text-gray-600">No reviews available yet.</p>
          </div>
        </TabsContent>

        <TabsContent value="customer" className="mt-0">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Customers</h2>
            <p className="text-gray-600">No customer data available yet.</p>
          </div>
        </TabsContent>

        <TabsContent value="lessons" className="mt-0">
          <div className="p-6">
            <LessonManager courseId={courseId as string} />
          </div>
        </TabsContent>

        <TabsContent value="details" className="mt-0">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Details</h2>
            <p className="text-gray-600">No additional details available yet.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}