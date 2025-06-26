"use client";

import { useGetAllCourses } from "@/hooks/course/useGetAllCourse";
import { useParams } from "next/navigation";
import { useGetInstructorDetails } from "@/hooks/instructor/useGetInstructorDetails";
import { IInstructorDetails } from "@/types/instructor";
import { UserInstructorDetail } from "@/components/instructor/UserInstructorDetail";
import InstructorDetailSkeleton from "@/components/skeleton/InstructorDetailSkeleton";
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
    return <InstructorDetailSkeleton />;
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
