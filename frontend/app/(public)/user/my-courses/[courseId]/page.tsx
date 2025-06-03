// File: components/course/CourseContent.tsx
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ILesson } from "@/types/lesson";
import { useGetAllLessonsInCourse } from "@/hooks/lesson/useGetAllLesson";
import { useGetContentByLessonId } from "@/hooks/content/useGetContentByLessonId";
import { useProgress } from "@/hooks/progress/useProgress";
import { useUpdateProgress } from "@/hooks/progress/useUpdateProgress";
import { LessonContent } from "@/components/course/enrolledCourse/EnrolledLessonContent";
import { EnrolledCourseSidebar } from "@/components/course/enrolledCourse/EnrolledCourseSideBar";
import { LessonContentSkeleton } from "@/components/course/enrolledCourse/skeletons/LessonContentSkeleton";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { LockOverlay } from "@/components/ui/LockOverlay";

interface LessonWithCompletion extends ILesson {
  completed: boolean;
  isLocked?: boolean;
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
  const { data: progressData, isLoading: isProgressLoading } = useProgress({
    courseId,
  });
  const { mutate: updateProgress, isLoading: isUpdatingProgress } =
    useUpdateProgress();

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
      const errorMessage =
        axiosError.response?.data?.message ||
        axiosError.message ||
        "Unknown error";
      console.log("errorMessage", errorMessage);

      if (
        errorMessage.toLowerCase().includes("not enrolled") ||
        errorMessage.toLowerCase().includes("don't have permission") ||
        errorMessage.toLowerCase().includes("not active")
      ) {
        toast.error("You need to enroll in this course to access the content");
        setTimeout(() => {
          router.push(`/courses/${courseId}`);
        }, 2000);
      } else {
        toast.error("Failed to load lesson content. Please try again.");
      }
    }
  }, [isContentError, contentError, courseId, router]);

  // Initialize lessons with completion status and locked state
  useEffect(() => {
    if (data?.lessons) {
      // First, create the array with completion status
      const lessonsWithCompletion: LessonWithCompletion[] = data.lessons.map(
        (lesson) => {
          const isCompleted = progressData?.lessonProgress?.find(
            (p) => p.lessonId === lesson.id
          )?.completed || false;

          return {
            ...lesson,
            completed: isCompleted,
            isLocked: false // Initialize as false, we'll update this in the next step
          };
        }
      );

      // Then, update the locked state based on previous lesson completion
      const lessonsWithLockedState = lessonsWithCompletion.map((lesson, index) => {
        const isLocked = index > 0 && !lessonsWithCompletion[index - 1].completed;
        return {
          ...lesson,
          isLocked
        };
      });

      setLessonsWithCompletion(lessonsWithLockedState);

      // Find the next lesson to learn
      const nextLessonToLearn = lessonsWithLockedState.find(lesson => !lesson.completed && !lesson.isLocked);
      
      if (nextLessonToLearn) {
        // If there's a lesson to learn, select it
        setSelectedLesson(nextLessonToLearn);
      } else if (progressData?.lastLessonId) {
        // If all lessons are completed, select the last lesson
        const lastLesson = lessonsWithLockedState.find(
          (lesson) => lesson.id === progressData.lastLessonId
        );
        if (lastLesson) {
          setSelectedLesson(lastLesson);
        } else if (lessonsWithLockedState.length > 0) {
          setSelectedLesson(lessonsWithLockedState[0]);
        }
      } else if (lessonsWithLockedState.length > 0) {
        setSelectedLesson(lessonsWithLockedState[0]);
      }
    }
  }, [data, progressData]);

  // Handle access status
  useEffect(() => {
    if (progressData?.accessStatus === "BLOCKED") {
      toast.error("Access Denied", {
        description:
          "Your access to this course has been blocked. Please contact support.",
      });
      router.push("/user/my-courses");
    } else if (progressData?.accessStatus === "EXPIRED") {
      toast.error("Access Expired", {
        description:
          "Your access to this course has expired. Please renew your enrollment.",
      });
      router.push("/user/my-courses");
    }
  }, [progressData?.accessStatus, router]);

  const allLessons = lessonsWithCompletion;
  const currentLessonIndex = allLessons.findIndex(
    (lesson) => lesson.id === selectedLesson?.id
  );

  const handleLessonSelect = (lesson: LessonWithCompletion) => {
    setSelectedLesson(lesson);
  };

  const markLessonComplete = () => {
    if (!selectedLesson || !courseId) return;

    // Update progress in the backend
    updateProgress({
      courseId: courseId,
      lessonId: selectedLesson.id,
      completed: true,
    });

    // Update local state
    setLessonsWithCompletion((prevLessons) =>
      prevLessons.map((lesson) =>
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

  const completedLessons = progressData?.completedLessons || 0;
  const totalLessons = progressData?.totalLessons || allLessons.length;
  const progressPercentage =
    totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

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
        {isError ? (
          <div className="flex flex-col items-center justify-center h-full space-y-4">
            <p className="text-red-600 text-lg">
              Unable to load course content
            </p>
            <button
              onClick={() => router.push("/user/my-courses")}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
            >
              Return to My Courses
            </button>
          </div>
        ) : isLoading || isProgressLoading ? (
          <LessonContentSkeleton />
        ) : selectedLesson ? (
          <div className="max-w-4xl mx-auto relative">
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
            {selectedLesson.isLocked && (
              <LockOverlay message="Complete the previous lesson to unlock this content" />
            )}
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
