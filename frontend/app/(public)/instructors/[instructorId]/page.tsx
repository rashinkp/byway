"use client";

import { useGetAllCourses } from "@/hooks/course/useGetAllCourse";
import { useParams } from "next/navigation";
import { useGetInstructorDetails } from "@/hooks/instructor/useGetInstructorDetails";
import { IInstructorDetails } from "@/types/instructor";
import { UserInstructorDetail } from "@/components/instructor/UserInstructorDetail";
import { Loader2 } from "lucide-react";

export default function InstructorDetailPage() {
  const params = useParams();
  const instructorId = params.instructorId as string;

  const {
    data: instructorData,
    isLoading: isInstructorLoading,
    error,
  } = useGetInstructorDetails(instructorId);

  const { data: coursesData, isLoading: isCoursesLoading } = useGetAllCourses({
    includeDeleted: false,
  });

  const instructor = instructorData?.data as IInstructorDetails;
  const instructorCourses = coursesData?.items;

  if (isInstructorLoading) {
    return (
      <div className="min-h-screen bg-gray-50/50 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex items-center justify-center min-h-[50vh]">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  if (!instructor) {
    return (
      <div className="min-h-screen bg-gray-50/50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-8">
            <div className="text-red-600 mb-2">Instructor Not Found</div>
            <p className="text-gray-600">The instructor you're looking for doesn't exist or has been removed.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <UserInstructorDetail
      instructor={instructor}
      courses={instructorCourses}
      isCoursesLoading={isCoursesLoading}
    />
  );
}
