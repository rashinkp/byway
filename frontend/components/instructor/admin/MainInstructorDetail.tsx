"use client";
import React from "react";
import { useParams } from "next/navigation";
import { useGetInstructorDetails } from "@/hooks/instructor/useGetInstructorDetails";
import { useToggleDeleteUser } from "@/hooks/user/useToggleDeleteUser";
import { approveInstructor, declineInstructor } from "@/api/instructor";
import { toast } from "sonner";
import { AdminInstructorDetail } from "@/components/instructor/AdminInstructorDetail";
import InstructorDetailSkeleton from "@/components/skeleton/InstructorDetailSkeleton";
import { useGetAllCourses } from "@/hooks/course/useGetAllCourse";
import ErrorDisplay from "@/components/ErrorDisplay";

const MainInstructorDetail: React.FC = () => {
  const params = useParams();
  const instructorId = params.instructorId as string;
  const { mutate: toggleDeleteUser } = useToggleDeleteUser();

  const {
    data: instructorData,
    isLoading: isInstructorLoading,
    error,
    refetch,
  } = useGetInstructorDetails(instructorId);

  console.log(instructorData);

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
    try {
      await approveInstructor(instructor.instructorId);
      await refetch();
      toast.success("Instructor approved successfully!");
    } catch (error) {
      console.error("Error approving instructor:", error);
      toast.error("Failed to approve instructor");
    }
  };

  const handleDecline = async () => {
    try {
      await declineInstructor(instructor.instructorId);
      await refetch();
      toast.success("Instructor declined successfully!");
    } catch (error) {
      console.error("Error declining instructor:", error);
      toast.error("Failed to decline instructor");
    }
  };

  const handleDelete = () => {
    toggleDeleteUser(instructor.userId, {
      onSuccess: () => {
        refetch();
      },
    });
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
    />
  );
};

export default MainInstructorDetail;
