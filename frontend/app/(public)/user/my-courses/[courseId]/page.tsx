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

interface LessonWithCompletion extends ILesson {
  completed: boolean;
  isLocked?: boolean;
  score?: number;
  totalQuestions?: number;
  answers?: IQuizAnswer[];
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

  // Fetch certificate
  const { certificate, loading: certLoading, error: certError, fetchCertificate, createCertificate } = useCertificate(courseId);

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
      } else if (lessonsWithLockedState.every(lesson => lesson.completed)) {
        // If all lessons are completed, select the last lesson
        setSelectedLesson(lessonsWithLockedState[lessonsWithLockedState.length - 1]);
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
      router.push("/user/my-courses");
    } else if (progressData?.accessStatus === "EXPIRED") {
      toast.error("Access Expired", {
        description:
          "Your access to this course has expired. Please renew your enrollment.",
      });
      router.push("/user/my-courses");
    }
  }, [progressData?.accessStatus, router]);

  // Fetch certificate when all lessons are completed
  useEffect(() => {
    if (lessonsWithCompletion.length > 0 && lessonsWithCompletion.every(lesson => lesson.completed)) {
      fetchCertificate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessonsWithCompletion]);

  // Add certificate as a pseudo-lesson
  const certificateStep: LessonWithCompletion = {
    id: "certificate",
    title: "🎓 Certificate",
    completed: !!certificate,
    isLocked: !lessonsWithCompletion.every(lesson => lesson.completed),
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

  const handleLessonSelect = (lesson: LessonWithCompletion | typeof certificateStep) => {
    setSelectedLesson(lesson);
  };

  const markLessonComplete = (quizData?: { 
    answers: IQuizAnswer[], 
    score: number, 
    totalQuestions: number 
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
    <div className="flex flex-col lg:flex-row w-full bg-gray-100 min-h-screen">
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
        ) : selectedLesson?.id === "certificate" ? (
          <div className="max-w-4xl mx-auto relative">
            <div className="mt-12 flex flex-col items-center justify-center bg-white rounded-lg shadow-lg p-8 border border-blue-100 animate-fade-in">
              <h2 className="text-2xl font-bold text-blue-700 mb-2">🎓 Course Certificate</h2>
              <p className="text-gray-600 mb-4">Congratulations! You have completed all lessons in this course.</p>
              {certLoading && <p className="text-blue-500">Checking for your certificate...</p>}
              {certError && <p className="text-red-500 mb-2">{certError}</p>}
              {certificate ? (
                <a
                  href={certificate.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition-colors mt-2"
                >
                  <span role="img" aria-label="certificate">📄</span> View/Download Certificate
                </a>
              ) : (
                <button
                  className="inline-block px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow hover:bg-green-700 transition-colors mt-2"
                  onClick={createCertificate}
                  disabled={certLoading}
                >
                  <span role="img" aria-label="generate">✨</span> Generate Certificate
                </button>
              )}
            </div>
          </div>
        ) : selectedLesson ? (
          <div className="max-w-4xl mx-auto relative">
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
