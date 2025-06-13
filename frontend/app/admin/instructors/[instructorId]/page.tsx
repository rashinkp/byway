'use client'
import React from "react";
import { useParams } from "next/navigation";
import { useGetInstructorDetails } from "@/hooks/instructor/useGetInstructorDetails";
import { useToggleDeleteUser } from "@/hooks/user/useToggleDeleteUser";
import { approveInstructor, declineInstructor } from "@/api/instructor";
import { toast } from "sonner";
import { AdminInstructorDetail } from "@/components/instructor/AdminInstructorDetail";
import { Loader2 } from "lucide-react";
import { useGetAllCourses } from "@/hooks/course/useGetAllCourse";

const InstructorProfilePage: React.FC = () => {
  const params = useParams();
  const instructorId = params.instructorId as string;
  const { mutate: toggleDeleteUser } = useToggleDeleteUser();

  const {
    data: instructorData,
    isLoading: isInstructorLoading,
    error,
    refetch
  } = useGetInstructorDetails(instructorId);

  console.log(instructorData);

  const { data: coursesData, isLoading: isCoursesLoading } = useGetAllCourses({
    includeDeleted: false,
  });

  const instructor = instructorData?.data;
  const instructorCourses = coursesData?.items;

  if (isInstructorLoading) {
    return (
      <div className="min-h-screen bg-gray-50/50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center min-h-[50vh]">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !instructor) {
    return (
      <div className="min-h-screen bg-gray-50/50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-8">
            <div className="text-red-600 mb-2">Error loading instructor profile</div>
            <p className="text-gray-600">There was an error loading the instructor profile. Please try again later.</p>
          </div>
        </div>
      </div>
    );
  }

  const handleApprove = async () => {
    try {
      await approveInstructor(instructor.userId);
      await refetch();
      toast.success("Instructor approved successfully!");
    } catch (error) {
      console.error("Error approving instructor:", error);
      toast.error("Failed to approve instructor");
    }
  };

  const handleDecline = async () => {
    try {
      await declineInstructor(instructor.userId);
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
        }
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

export default InstructorProfilePage;
