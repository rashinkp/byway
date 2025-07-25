// File: components/course/CourseContent.tsx
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ILesson, LessonStatus } from "@/types/lesson";
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
import { IQuizAnswer } from "@/types/progress";
import { useCertificate } from "@/hooks/certificate/useCertificate";
import { CertificateActions } from "@/components/course/enrolledCourse/CertificateActions";

interface LessonWithCompletion extends ILesson {
  completed: boolean;
  isLocked?: boolean;
  score?: number;
  totalQuestions?: number;
  answers?: IQuizAnswer[];
}

export default function MainContentSection() {
  const [selectedLesson, setSelectedLesson] =
    useState<LessonWithCompletion | null>(null);
  const [lessonsWithCompletion, setLessonsWithCompletion] = useState<
    LessonWithCompletion[]
  >([]);
  const [page, setPage] = useState(1);
  const limit = 10;
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 1024;

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
  const { mutate: updateProgress } = useUpdateProgress();

  // Fetch content for the selected lesson
  const {
    data: content,
    isLoading: isContentLoading,
    isError: isContentError,
    error: contentError,
  } = useGetContentByLessonId(selectedLesson?.id || "");

  // Fetch certificate
  const { certificate, fetchCertificate } = useCertificate(courseId);

  // Add state for error message
  // Removed unused regenError and setRegenError

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
        console.log("errorMessage", errorMessage);
      }
    }
  }, [isContentError, contentError, courseId, router]);

  // Initialize lessons with completion status and locked state
  useEffect(() => {
    if (data?.lessons) {
      // First, create the array with completion status
      const lessonsWithCompletion: LessonWithCompletion[] = data.lessons.map(
        (lesson) => {
          const lessonProgress = progressData?.lessonProgress?.find(
            (p) => p.lessonId === lesson.id
          );

          return {
            ...lesson,
            completed: lessonProgress?.completed || false,
            score: lessonProgress?.score,
            totalQuestions: lessonProgress?.totalQuestions,
            answers: lessonProgress?.answers,
            isLocked: false, // Initialize as false, we'll update this in the next step
          };
        }
      );

      // Then, update the locked state based on previous lesson completion
      const lessonsWithLockedState = lessonsWithCompletion.map(
        (lesson, index) => {
          const isLocked =
            index > 0 && !lessonsWithCompletion[index - 1].completed;
          return {
            ...lesson,
            isLocked,
          };
        }
      );

      setLessonsWithCompletion(lessonsWithLockedState);

      // Find the next lesson to learn
      const nextLessonToLearn = lessonsWithLockedState.find(
        (lesson) => !lesson.completed && !lesson.isLocked
      );

      if (nextLessonToLearn) {
        // If there's a lesson to learn, select it
        setSelectedLesson(nextLessonToLearn);
      } else if (lessonsWithLockedState.every((lesson) => lesson.completed)) {
        // If all lessons are completed, select the last lesson
        setSelectedLesson(
          lessonsWithLockedState[lessonsWithLockedState.length - 1]
        );
      } else if (progressData?.lastLessonId) {
        // If not all completed, try to select the last lesson from progress
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
      router.push("/user/profile?section=courses");
    } else if (progressData?.accessStatus === "EXPIRED") {
      toast.error("Access Expired", {
        description:
          "Your access to this course has expired. Please renew your enrollment.",
      });
      router.push("/user/profile?section=courses");
    }
  }, [progressData?.accessStatus, router]);

  // Fetch certificate when all lessons are completed
  useEffect(() => {
    if (
      lessonsWithCompletion.length > 0 &&
      lessonsWithCompletion.every((lesson) => lesson.completed)
    ) {
      fetchCertificate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessonsWithCompletion]);

  // Add certificate as a pseudo-lesson
  const certificateStep: LessonWithCompletion = {
    id: "certificate",
    title: "🎓 Certificate",
    completed: !!certificate,
    isLocked: !lessonsWithCompletion.every((lesson) => lesson.completed),
    courseId: courseId,
    order: lessonsWithCompletion.length + 1,
    status: LessonStatus.PUBLISHED,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const allItems = [...lessonsWithCompletion, certificateStep];

  const currentLessonIndex = allItems.findIndex(
    (lesson) => lesson.id === selectedLesson?.id
  );

  const handleLessonSelect = (
    lesson: LessonWithCompletion | typeof certificateStep
  ) => {
    setSelectedLesson(lesson);
  };

  const markLessonComplete = (quizData?: {
    answers: IQuizAnswer[];
    score: number;
    totalQuestions: number;
  }) => {
    if (!selectedLesson || !courseId) return;

    // Update progress in the backend
    updateProgress({
      courseId: courseId,
      lessonId: selectedLesson.id,
      completed: true,
      ...(quizData && {
        quizAnswers: quizData.answers,
        score: quizData.score,
        totalQuestions: quizData.totalQuestions,
      }),
    });

    // Update local state
    setLessonsWithCompletion((prevLessons) =>
      prevLessons.map((lesson) =>
        lesson.id === selectedLesson.id
          ? {
              ...lesson,
              completed: true,
              ...(quizData && {
                score: quizData.score,
                totalQuestions: quizData.totalQuestions,
                answers: quizData.answers,
              }),
            }
          : lesson
      )
    );
  };

  const goToNextLesson = () => {
    if (currentLessonIndex < allItems.length - 1) {
      setSelectedLesson(allItems[currentLessonIndex + 1]);
    }
  };

  const goToPrevLesson = () => {
    if (currentLessonIndex > 0) {
      setSelectedLesson(allItems[currentLessonIndex - 1]);
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
  const totalLessons = progressData?.totalLessons || allItems.length;
  const progressPercentage =
    totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  return (
    <div className="flex flex-col lg:flex-row w-full min-h-screen bg-white dark:bg-[#18181b]">
      {/* Mobile Lessons Button */}
      <div className="lg:hidden w-full p-4 flex items-center justify-between sticky top-0 z-40 bg-white dark:bg-[#18181b]">
        <button
          className="px-4 py-2 bg-[#facc15] text-black rounded-lg font-semibold shadow hover:bg-[#facc15]/90 transition"
          onClick={() => setSidebarOpen(true)}
        >
          Lessons
        </button>
        <div className="flex-1 ml-4">
          <div className="relative h-2 bg-gray-100 dark:bg-[#232323] rounded-full overflow-hidden">
            <div
              className="absolute h-full bg-gradient-to-r from-blue-400 to-indigo-500 dark:from-yellow-400 dark:to-yellow-500 transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-300 mt-1">
            {progressPercentage.toFixed(0)}% complete
          </p>
        </div>
      </div>
      {/* Sidebar as modal on mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center lg:hidden">
          <div className="relative w-full max-w-xs bg-white dark:bg-[#18181b] shadow-xl rounded-xl p-4 flex flex-col mt-20 mx-2 overflow-y-auto max-h-[80vh]">
            <button
              className="absolute top-2 right-2 text-black dark:text-white text-2xl font-bold"
              onClick={() => setSidebarOpen(false)}
              aria-label="Close lessons sidebar"
            >
              ×
            </button>
            <EnrolledCourseSidebar
              courseTitle="Introduction to User Experience Design"
              progressPercentage={progressPercentage}
              isLoading={isLoading || isProgressLoading}
              isError={isError}
              error={error}
              allLessons={allItems}
              selectedLesson={selectedLesson}
              handleLessonSelect={(lesson) => {
                handleLessonSelect(lesson);
                setSidebarOpen(false);
              }}
              data={data}
              page={page}
              goToPreviousPage={goToPreviousPage}
              goToNextPage={goToNextPage}
            />
          </div>
          <div className="fixed inset-0" onClick={() => setSidebarOpen(false)} />
        </div>
      )}
      {/* Sidebar on desktop */}
      <div className="hidden lg:block">
        <EnrolledCourseSidebar
          courseTitle="Introduction to User Experience Design"
          progressPercentage={progressPercentage}
          isLoading={isLoading || isProgressLoading}
          isError={isError}
          error={error}
          allLessons={allItems}
          selectedLesson={selectedLesson}
          handleLessonSelect={handleLessonSelect}
          data={data}
          page={page}
          goToPreviousPage={goToPreviousPage}
          goToNextPage={goToNextPage}
        />
      </div>
      <div className="flex-1 p-4 lg:p-8 xl:p-12 bg-white dark:bg-[#18181b]">
        {isError ? (
          <div className="flex flex-col items-center justify-center h-full space-y-6 animate-fade-in">
            <div className="w-24 h-24 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center mb-4">
              <svg
                className="w-12 h-12 text-red-500 dark:text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
              Unable to Load Course
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-center max-w-md">
              We're having trouble loading the course content. Please try again
              or return to your courses.
            </p>
            <button
              onClick={() => router.push("/user/profile?section=courses")}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Return to My Courses
            </button>
          </div>
        ) : isLoading || isProgressLoading ? (
          <LessonContentSkeleton />
        ) : selectedLesson?.id === "certificate" ? (
          <CertificateActions courseId={courseId} />
        ) : selectedLesson ? (
          <div className="max-w-5xl mx-auto relative">
            <LessonContent
              selectedLesson={selectedLesson}
              content={content}
              isContentLoading={isContentLoading}
              isContentError={isContentError}
              contentError={contentError}
              currentLessonIndex={currentLessonIndex}
              allLessons={allItems}
              goToPrevLesson={goToPrevLesson}
              goToNextLesson={goToNextLesson}
              markLessonComplete={markLessonComplete}
            />
            {selectedLesson.isLocked && (
              <LockOverlay message="Complete the previous lesson to unlock this content" />
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full space-y-6 animate-fade-in">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900 dark:to-indigo-900 flex items-center justify-center mb-4">
              <svg
                className="w-16 h-16 text-blue-500 dark:text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
              Ready to Learn?
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-center max-w-md">
              Select a lesson from the sidebar to begin your learning journey
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
