"use client";

import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { BookOpen, CheckCircle, XCircle } from "lucide-react";
import { LessonManager } from "@/components/lesson/LessonManager";
import { Course } from "@/types/course";
import { useGetCourseById } from "@/hooks/course/useGetCourseById";
// import { useUpdateCourseStatus } from "@/hooks/course/useUpdateCourseStatus";
import CourseHeader from "@/components/course/CourseHeader";
import PlaceHolderImage from "@/public/placeHolder.jpg";
import { StaticImageData } from "next/image";

// Course Thumbnail Component
function CourseThumbnail({
  src,
  alt,
}: {
  src: string | StaticImageData;
  alt: string;
}) {
  // Convert src to string if it's a StaticImageData object
  const srcString = typeof src === "string" ? src : src.src;

  return (
    <div className="lg:col-span-1">
      <img
        src={srcString}
        alt={alt}
        className="w-full h-48 object-cover rounded-lg shadow-sm border border-gray-200"
      />
    </div>
  );
}

// Course Details Component
function CourseDetails({
  course,
  onPublish,
}: {
  course: Course;
  onPublish: () => void;
}) {
  return (
    <div className="lg:col-span-2">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="space-y-6">
          {/* Description */}
          <div>
            <h2 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-blue-500" />
              Description
            </h2>
            <p className="text-gray-600 mt-2 text-sm leading-relaxed">
              {course.description || "No description available."}
            </p>
          </div>
          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div>
              <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Level
              </h3>
              <p className="text-gray-800 text-sm font-medium">
                {course.level}
              </p>
            </div>
            <div>
              <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Status
              </h3>
              <StatusBadge isActive={course.status === "PUBLISHED"} />
            </div>
            <div>
              <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Price
              </h3>
              <p className="text-gray-800 text-sm font-medium">
                ${course?.price?.toFixed(2) || 0}
              </p>
            </div>
            <div>
              <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Duration
              </h3>
              <p className="text-gray-800 text-sm font-medium">
                {course.duration} min
              </p>
            </div>
          </div>
          {/* Publish Button */}
          <div className="flex justify-end">
            <Button
              onClick={onPublish}
              className={
                course.status === "PUBLISHED"
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-green-600 hover:bg-green-700"
              }
            >
              {course.status === "PUBLISHED" ? (
                <XCircle className="mr-2 h-4 w-4" />
              ) : (
                <CheckCircle className="mr-2 h-4 w-4" />
              )}
              {course.status === "PUBLISHED" ? "Unpublish" : "Publish"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main Course Detail Page
export default function CourseDetailPage() {
  const { courseId } = useParams();
  const router = useRouter();
  const {
    data: course,
    isLoading,
    error,
  } = useGetCourseById(courseId as string);
  // const { mutate: updateCourseStatus, isPending: isPublishing } =
  //   useUpdateCourseStatus();

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="animate-pulse">
          <div className="h-8 w-1/2 bg-gray-200 rounded mb-6"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="h-48 bg-gray-200 rounded-lg"></div>
            <div className="lg:col-span-2 bg-gray-200 p-6 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="container mx-auto py-8 px-4">
        <p className="text-red-500">
          Error: {error?.message || "Course not found"}
        </p>
        <Button
          variant="outline"
          onClick={() => router.push("/instructor/courses")}
          className="mt-4"
        >
          Back to Courses
        </Button>
      </div>
    );
  }

  const handlePublish = () => {
    // updateCourseStatus(
    //   {
    //     courseId: course.id,
    //     status: course.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED",
    //   },
    //   {
    //     onSuccess: () => {
    //       console.log("Course status updated successfully");
    //     },
    //     onError: (err:any) => {
    //       console.error("Failed to update course status:", err);
    //     },
    //   }
    // );
  };

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <CourseHeader
        title={course.title}
      />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
        <CourseThumbnail
          src={PlaceHolderImage}
          alt={course.title}
        />
        <CourseDetails course={course} onPublish={handlePublish} />
      </div>
      <LessonManager courseId={courseId as string} />
    </div>
  );
}
