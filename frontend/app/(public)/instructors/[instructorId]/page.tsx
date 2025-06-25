"use client";

import { useGetAllCourses } from "@/hooks/course/useGetAllCourse";
import { useParams } from "next/navigation";
import { useGetInstructorDetails } from "@/hooks/instructor/useGetInstructorDetails";
import { IInstructorDetails } from "@/types/instructor";
import { UserInstructorDetail } from "@/components/instructor/UserInstructorDetail";
import { Loader2 } from "lucide-react";
import ErrorDisplay from "@/components/ErrorDisplay";

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
      <ErrorDisplay error={"Instructor Not Found"} title="Instructor Not Found" description="The instructor you're looking for doesn't exist or has been removed." />
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
