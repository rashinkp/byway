// File: components/course/CourseContent.tsx
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ILesson } from "@/types/lesson";
import { useGetAllLessonsInCourse } from "@/hooks/lesson/useGetAllLesson";
import { useGetContentByLessonId } from "@/hooks/content/useGetContentByLessonId";
import { useProgress } from "@/hooks/progress/useProgress";
import { useUpdateProgress } from "@/hooks/progress/useUpdateProgress";
import { LessonNavigation } from "@/components/course/enrolledCourse/EnrolledCourseLessonNavigation";
import { LessonContent } from "@/components/course/enrolledCourse/EnrolledLessonContent";
import { EnrolledCourseSidebar } from "@/components/course/enrolledCourse/EnrolledCourseSideBar";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { toast } from "sonner";
import { AxiosError } from "axios";

interface LessonWithCompletion extends ILesson {
  completed: boolean;
}

export default function CourseContent() {
  const [selectedLesson, setSelectedLesson] =
    useState<LessonWithCompletion | null>(null);
  const [lessonsWithCompletion, setLessonsWithCompletion] = useState<
    LessonWithCompletion[]
  >([]);
  const [page, setPage] = useState(1);
  const limit = 10;

  const params = useParams();
  const courseId = params.courseId as string;
  const router = useRouter();

  // Fetch lessons
  const { data, isLoading, isError, error } = useGetAllLessonsInCourse({
    courseId,
    page,
    limit,
    sortBy: "order",
    sortOrder: "asc",
    filterBy: "PUBLISHED",
    includeDeleted: false,
  });

  // Fetch progress
  const { data: progressData, isLoading: isProgressLoading } = useProgress({ courseId });
  const { mutate: updateProgress, isLoading: isUpdatingProgress } = useUpdateProgress();

  // Fetch content for the selected lesson
  const {
    data: content,
    isLoading: isContentLoading,
    isError: isContentError,
    error: contentError,
  } = useGetContentByLessonId(selectedLesson?.id || "");

  // Handle content errors
  useEffect(() => {
    if (isContentError && contentError) {
      console.log("contentError", contentError);
      const axiosError = contentError as AxiosError<{ message: string }>;
      const errorMessage = axiosError.response?.data?.message || axiosError.message || "Unknown error";
      console.log("errorMessage", errorMessage);

      if (errorMessage.toLowerCase().includes("not enrolled") || 
          errorMessage.toLowerCase().includes("don't have permission") ||
          errorMessage.toLowerCase().includes("not active")) {
        toast.error("You need to enroll in this course to access the content");
        setTimeout(() => {
          router.push(`/courses/${courseId}`);
        }, 2000);
      } else {
        toast.error("Failed to load lesson content. Please try again.");
      }
    }
  }, [isContentError, contentError, courseId, router]);

  // Initialize lessons with completion status
  useEffect(() => {
    if (data?.lessons) {
      const initializedLessons: LessonWithCompletion[] = data.lessons.map(
        (lesson) => ({
          ...lesson,
          completed: progressData?.lastLessonId === lesson.id || false,
        })
      );
      setLessonsWithCompletion(initializedLessons);
      
      // If there's a last lesson ID in progress, select that lesson
      if (progressData?.lastLessonId) {
        const lastLesson = initializedLessons.find(
          lesson => lesson.id === progressData.lastLessonId
        );
        if (lastLesson) {
          setSelectedLesson(lastLesson);
        } else if (initializedLessons.length > 0) {
          setSelectedLesson(initializedLessons[0]);
        }
      } else if (initializedLessons.length > 0) {
        setSelectedLesson(initializedLessons[0]);
      }
    }
  }, [data, progressData]);

  const allLessons = lessonsWithCompletion;
  const currentLessonIndex = allLessons.findIndex(
    (lesson) => lesson.id === selectedLesson?.id
  );

  const handleLessonSelect = (lesson: LessonWithCompletion) => {
    setSelectedLesson(lesson);
  };

  const markLessonComplete = () => {
    if (!selectedLesson || !courseId) return;

    const completedLessons = allLessons.filter(lesson => lesson.completed).length + 1;
    const totalLessons = allLessons.length;
    const progressPercentage = Math.round((completedLessons / totalLessons) * 100);

    // Update progress in the backend
    updateProgress({
      courseId: courseId,
      progress: progressPercentage,
      lastLessonId: selectedLesson.id
    });

    // Update local state
    setLessonsWithCompletion(prevLessons =>
      prevLessons.map(lesson =>
        lesson.id === selectedLesson.id
          ? { ...lesson, completed: true }
          : lesson
      )
    );
  };

  const goToNextLesson = () => {
    if (currentLessonIndex < allLessons.length - 1) {
      setSelectedLesson(allLessons[currentLessonIndex + 1]);
    }
  };

  const goToPrevLesson = () => {
    if (currentLessonIndex > 0) {
      setSelectedLesson(allLessons[currentLessonIndex - 1]);
    }
  };

  const goToPreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const goToNextPage = () => {
    if (data && page < data.totalPages) {
      setPage(page + 1);
    }
  };

  const completedLessons = allLessons.filter(lesson => lesson.completed).length;
  const progressPercentage = progressData?.progress || 
    (allLessons.length > 0 ? (completedLessons / allLessons.length) * 100 : 0);

  return (
    <div className="flex flex-col lg:flex-row w-full bg-gray-100 min-h-screen">
      <EnrolledCourseSidebar
        courseTitle="Introduction to User Experience Design"
        progressPercentage={progressPercentage}
        isLoading={isLoading || isProgressLoading}
        isError={isError}
        error={error}
        allLessons={allLessons}
        selectedLesson={selectedLesson}
        handleLessonSelect={handleLessonSelect}
        data={data}
        page={page}
        goToPreviousPage={goToPreviousPage}
        goToNextPage={goToNextPage}
      />
      <div className="flex-1 p-6 lg:p-10">
        {isLoading || isProgressLoading ? (
          <LoadingSpinner 
            size="lg" 
            text="Loading course content..." 
            className="h-[50vh]"
          />
        ) : isError ? (
          <div className="flex flex-col items-center justify-center h-full space-y-4">
            <p className="text-red-600 text-lg">Unable to load course content</p>
            <button 
              onClick={() => router.push("/user/my-courses")}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
            >
              Return to My Courses
            </button>
          </div>
        ) : selectedLesson ? (
          <div className="max-w-4xl mx-auto">
            <LessonContent
              selectedLesson={selectedLesson}
              content={content}
              isContentLoading={isContentLoading}
              isContentError={isContentError}
              contentError={contentError}
              currentLessonIndex={currentLessonIndex}
              allLessons={allLessons}
              goToPrevLesson={goToPrevLesson}
              goToNextLesson={goToNextLesson}
              markLessonComplete={markLessonComplete}
            />
            <LessonNavigation
              currentLessonIndex={currentLessonIndex}
              allLessons={allLessons}
              selectedLesson={selectedLesson}
              goToPrevLesson={goToPrevLesson}
              goToNextLesson={goToNextLesson}
            />
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500 text-lg">Select a lesson to begin</p>
          </div>
        )}
      </div>
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out;
        }
        video::-webkit-media-controls-panel {
          background-color: rgba(0, 0, 0, 0.7);
        }
        video::-webkit-media-controls-play-button,
        video::-webkit-media-controls-volume-slider,
        video::-webkit-media-controls-mute-button,
        video::-webkit-media-controls-timeline,
        video::-webkit-media-controls-current-time-display {
          filter: brightness(1.2);
        }
      `}</style>
    </div>
  );
}


