"use client";

import React from "react";
import { Loader2 } from "lucide-react";
import { useGetCourseById } from "@/hooks/course/useGetCourseById";
import { useGetAllLessonsInCourse } from "@/hooks/lesson/useGetAllLesson";
import { useGetPublicUser } from "@/hooks/user/useGetPublicUser";
import {
  useApproveCourse,
  useDeclineCourse,
} from "@/hooks/course/useApproveCourse";
import { useSoftDeleteCourse } from "@/hooks/course/useSoftDeleteCourse";
import { useParams } from "next/navigation";
import { CourseDetailLayout } from "@/components/course/course-detail";
import AdminActions from "@/components/course/course-detail/AdminActions";

// Admin Course Details Component
const MainAdminCourseDetails: React.FC = () => {
  const params = useParams();
  const courseId = params.courseId as string;

  const {
    data: courseData,
    isLoading: isCourseLoading,
    refetch: refetchCourse,
  } = useGetCourseById(courseId);
  const { data: lessonsData, isLoading: isLessonsLoading } =
    useGetAllLessonsInCourse({
      courseId,
      limit: 100,
      sortBy: "order",
      sortOrder: "asc",
    });
  const { data: instructorData } = useGetPublicUser(
    courseData?.createdBy || "",
  );
  const { mutate: approveCourse, isPending: isApproving } = useApproveCourse();
  const { mutate: declineCourse, isPending: isDeclining } = useDeclineCourse();
  const { mutate: toggleCourseStatus, isPending: isTogglingStatus } =
    useSoftDeleteCourse();

  const handleApprove = () => {
    if (!courseData) return;
    approveCourse({ courseId: courseData.id });
    refetchCourse();
  };

  const handleDecline = () => {
    if (!courseData) return;
    declineCourse({ courseId: courseData.id });
    refetchCourse();
  };

  const handleToggleStatus = () => {
    if (!courseData) return;
    toggleCourseStatus(courseData);
    refetchCourse();
  };

  if (isCourseLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (!courseData) {
    return (
      <div className="text-center py-8">
        <div className="text-red-600 mb-2">Course Not Found</div>
        <p className="text-gray-600">
          The course you&apos;re looking for doesn&apos;t exist or has been removed.
        </p>
      </div>
    );
  }

  // Create AdminActions component for sidebar
  const adminActionsComponent = (
    <AdminActions
      course={courseData}
      isApproving={isApproving}
      isDeclining={isDeclining}
      isTogglingStatus={isTogglingStatus}
      onApprove={handleApprove}
      onDecline={handleDecline}
      onToggleStatus={handleToggleStatus}
    />
  );

  return (
    <CourseDetailLayout
      course={courseData}
      instructor={instructorData}
      lessons={lessonsData?.lessons}
      isLoading={{
        course: isCourseLoading,
        instructor: false,
        lessons: isLessonsLoading,
        user: false,
      }}
      error={null}
      sidebarProps={{
        adminActions: adminActionsComponent,
      }}
    />
  );
};

export default MainAdminCourseDetails;
