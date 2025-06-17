'use client';

import React, { useState } from "react";
import {
  Play,
  BookOpen,
  CheckCircle,
  Calendar,
  ChevronDown,
  ChevronUp,
  FileText,
  Loader2,
  Edit2,
  CheckCircle2,
  AlertCircle,
  DollarSign,
  Percent,
  Settings,
  Star,
} from "lucide-react";
import { useGetCourseById } from "@/hooks/course/useGetCourseById";
import { useGetAllLessonsInCourse } from "@/hooks/lesson/useGetAllLesson";
import { useGetPublicUser } from "@/hooks/user/useGetPublicUser";
import { useApproveCourse, useDeclineCourse } from "@/hooks/course/useApproveCourse";
import { useSoftDeleteCourse } from "@/hooks/course/useSoftDeleteCourse";
import { useParams, useRouter } from "next/navigation";
import { ILesson } from "@/types/lesson";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { CourseDetailLayout } from "@/components/course/course-detail";
import AdminActions from "@/components/course/course-detail/AdminActions";
import CourseReviews from "@/components/review/CourseReviews";

// Lesson Card Component
const LessonCard: React.FC<{
  lesson: ILesson;
  isExpanded: boolean;
  onToggle: () => void;
}> = ({ lesson, isExpanded, onToggle }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg">
      <button
        onClick={onToggle}
        className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
          </div>
          <div className="text-left">
            <h4 className="font-medium text-gray-900">
              {lesson.title}
            </h4>
            <p className="text-sm text-gray-500">
              {lesson.description}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">5 min</span>
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 text-gray-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-400" />
          )}
        </div>
      </button>
    </div>
  );
};

// Admin Course Details Component
const AdminCourseDetails: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const courseId = params.courseId as string;
  const [expandedLessons, setExpandedLessons] = useState<string[]>([]);

  const { data: courseData, isLoading: isCourseLoading, refetch: refetchCourse } = useGetCourseById(courseId);
  const { data: lessonsData, isLoading: isLessonsLoading } = useGetAllLessonsInCourse({
    courseId,
    limit: 100,
    sortBy: "order",
    sortOrder: "asc",
  });
  const { data: instructorData } = useGetPublicUser(courseData?.createdBy || '');
  const { mutate: approveCourse, isPending: isApproving } = useApproveCourse();
  const { mutate: declineCourse, isPending: isDeclining } = useDeclineCourse();
  const { mutate: toggleCourseStatus, isPending: isTogglingStatus } = useSoftDeleteCourse();

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

  const toggleLessonExpansion = (lessonId: string) => {
    setExpandedLessons((prev) =>
      prev.includes(lessonId)
        ? prev.filter((id) => id !== lessonId)
        : [...prev, lessonId]
    );
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
        <p className="text-gray-600">The course you're looking for doesn't exist or has been removed.</p>
      </div>
    );
  }

  // Custom tabs for admin
  const customTabs = [
    {
      id: "actions",
      label: "Admin Actions",
      icon: <Settings className="w-4 h-4" />,
    },
  ];

  // Custom tab content for admin
  const customTabContent = {
    actions: (
      <AdminActions
        course={courseData}
        isApproving={isApproving}
        isDeclining={isDeclining}
        isTogglingStatus={isTogglingStatus}
        onApprove={handleApprove}
        onDecline={handleDecline}
        onToggleStatus={handleToggleStatus}
      />
    ),
    curriculum: (
      <div className="space-y-6">
        <div className="flex items-center gap-2 text-gray-900">
          <Play className="w-5 h-5" />
          <h2 className="text-lg font-semibold">Course Curriculum</h2>
        </div>
        <Separator />
        {isLessonsLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : lessonsData?.lessons && lessonsData.lessons.length > 0 ? (
          <div className="space-y-4">
            {lessonsData.lessons.map((lesson: ILesson) => (
              <LessonCard
                key={lesson.id}
                lesson={lesson}
                isExpanded={expandedLessons.includes(lesson.id)}
                onToggle={() => toggleLessonExpansion(lesson.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No lessons available for this course yet.
          </div>
        )}
      </div>
    ),
  };

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
      sidebarProps={{}}
      tabContent={customTabContent}
      customTabs={customTabs}
      showReviews={true}
    />
  );
};

export default AdminCourseDetails;
