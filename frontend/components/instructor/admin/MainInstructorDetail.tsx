"use client";
import React from "react";
import { useParams } from "next/navigation";
import { useGetInstructorDetails } from "@/hooks/instructor/useGetInstructorDetails";
import { useToggleDeleteUser } from "@/hooks/user/useToggleDeleteUser";
import { useApproveInstructor } from "@/hooks/instructor/useApproveInstructor";
import { useDeclineInstructor } from "@/hooks/instructor/useDeclineInstructor";
import { toast } from "sonner";
import { AdminInstructorDetail } from "@/components/instructor/AdminInstructorDetail";
import InstructorDetailSkeleton from "@/components/skeleton/InstructorDetailSkeleton";
import { useGetAllCourses } from "@/hooks/course/useGetAllCourse";
import ErrorDisplay from "@/components/ErrorDisplay";

const MainInstructorDetail: React.FC = () => {
  const params = useParams();
  const instructorId = params.instructorId as string;
  const { mutate: toggleDeleteUser, isPending: isDeleting } = useToggleDeleteUser();
  const { mutate: approveInstructor, isPending: isApproving } = useApproveInstructor();
  const { mutate: declineInstructor, isPending: isDeclining } = useDeclineInstructor();

  const {
    data: instructorData,
    isLoading: isInstructorLoading,
    error,
  } = useGetInstructorDetails(instructorId);

  const { data: coursesData, isLoading: isCoursesLoading } = useGetAllCourses({
    includeDeleted: false,
  });

  const instructor = instructorData?.data;
  const instructorCourses = coursesData?.items;

  if (isInstructorLoading) {
    return <InstructorDetailSkeleton />;
  }

  if (error || !instructor) {
    return (
      <ErrorDisplay
        error={error || "No instructor found"}
        title="Error loading instructor profile"
        description="There was an error loading the instructor profile. Please try again later."
      />
    );
  }

  const handleApprove = async () => {
    approveInstructor(instructor.instructorId);
  };

  const handleDecline = async () => {
    declineInstructor(instructor.instructorId);
  };

  const handleDelete = () => {
    toggleDeleteUser(instructor.userId);
  };

  const handleDownloadCV = () => {
    if (instructor.cv && instructor.cv !== "No CV provided") {
      window.open(instructor.cv, "_blank");
    } else {
      toast.error("No CV available for download");
    }
  };

  return (
    <AdminInstructorDetail
      instructor={instructor}
      courses={instructorCourses}
      isCoursesLoading={isCoursesLoading}
      onApprove={handleApprove}
      onDecline={handleDecline}
      onToggleDelete={handleDelete}
      onDownloadCV={handleDownloadCV}
      isDeleting={isDeleting}
    />
  );
};

export default MainInstructorDetail;
