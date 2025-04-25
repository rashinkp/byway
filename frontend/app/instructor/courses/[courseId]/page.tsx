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

export default function CourseDetailPage() {
  const { courseId } = useParams();
  const router = useRouter();
  const {
    data: course,
    isLoading,
    error,
  } = useGetCourseById(courseId as string);
  

  const fileInputRef = useRef<HTMLInputElement>(null);


  //todo: implement thumbnail upload and course status update
  const { mutate: updateThumbnail, isPending: isUploading } = useMutation({
    // mutationFn: async (file: File) => {
    //   const formData = new FormData();
    //   formData.append("thumbnail", file);
    //   const response = await api.post(`/courses/${courseId}/thumbnail`, formData, {
    //     headers: { "Content-Type": "multipart/form-data" },
    //   });
    //   return response.data;
    // },
    // onSuccess: () => {
    //   queryClient.invalidateQueries({ queryKey: ["course", courseId] });
    // },
    // onError: (err) => {
    //   console.error("Failed to upload thumbnail:", err);
    // },
  });

  const { mutate: updateCourseStatus, isPending: isPublishing } = useMutation({
    // mutationFn: async ({ courseId, status }: { courseId: string; status: "PUBLISHED" | "DRAFT" }) => {
    //   const response = await api.patch(`/courses/${courseId}`, { status });
    //   return response.data;
    // },
    // onSuccess: () => {
    //   queryClient.invalidateQueries({ queryKey: ["course", courseId] });
    // },
    // onError: (err) => {
    //   console.error("Failed to update course status:", err);
    // },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // if (e.target.files && e.target.files[0]) {
    //   updateThumbnail(e.target.files[0]);
    // }
  };

  const handlePublish = () => {
    // updateCourseStatus({
    //   courseId: courseId as string,
    //   status: course?.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED",
    // });
  };

  if (error) {
    return (
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center max-w-2xl mx-auto">
          <p className="text-red-500 font-medium text-lg mb-4">
            {error?.message || "Course not found"}
          </p>
          <Button
            variant="outline"
            onClick={() => router.push("/instructor/courses")}
            className="inline-flex items-center"
          >
            <FileEdit className="h-4 w-4 mr-2" />
            Back to Courses
          </Button>
        </div>
      </div>
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
            onPublish={handlePublish}
            src={PlaceHolderImage}
            alt={course?.title || "Course Thumbnail"}
            onImageChange={() => fileInputRef.current?.click()}
            isUploading={isUploading}
          />
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
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
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
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