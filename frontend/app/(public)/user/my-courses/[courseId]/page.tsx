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
    <div className="flex flex-col lg:flex-row w-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 min-h-screen">
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
      <div className="flex-1 p-4 lg:p-8 xl:p-12">
        {isError ? (
          <div className="flex flex-col items-center justify-center h-full space-y-6 animate-fade-in">
            <div className="w-24 h-24 rounded-full bg-red-100 flex items-center justify-center mb-4">
              <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Unable to Load Course</h3>
            <p className="text-gray-600 text-center max-w-md">
              We're having trouble loading the course content. Please try again or return to your courses.
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
          <div className="max-w-5xl mx-auto relative animate-fade-in">
            {/* Celebration Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center p-4 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full mb-4 animate-bounce">
                <span className="text-4xl">🎉</span>
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                Congratulations!
              </h1>
              <p className="text-xl text-gray-600">You've successfully completed the course</p>
            </div>

            {/* Certificate Container */}
            <div className="relative overflow-hidden rounded-3xl bg-white shadow-2xl border border-gray-200">
              {/* Decorative Background Pattern */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0" style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.4'%3E%3Cpath d='m36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                }} />
              </div>

              {/* Header Section */}
              <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 px-8 py-12 text-center text-white">
                <div className="absolute top-4 left-4 right-4 flex justify-between">
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                    <span className="text-lg">🏆</span>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                    <span className="text-lg">⭐</span>
                  </div>
                </div>
                
                <div className="mb-6">
                  <div className="w-20 h-20 mx-auto bg-white/10 rounded-full flex items-center justify-center mb-4 backdrop-blur-sm">
                    <span className="text-4xl">🎓</span>
                  </div>
                  <h2 className="text-3xl lg:text-4xl font-bold mb-2">Certificate of Completion</h2>
                  <div className="w-24 h-1 bg-white/50 mx-auto rounded-full"></div>
                </div>

                <div className="space-y-3">
                  <p className="text-lg opacity-90">This is to certify that</p>
                  <h3 className="text-2xl lg:text-3xl font-bold text-yellow-300">
                    {certificate?.userName || "Student Name"}
                  </h3>
                  <p className="text-lg opacity-90">has successfully completed</p>
                  <h4 className="text-xl lg:text-2xl font-semibold">
                    {certificate?.courseTitle || "Course Title"}
                  </h4>
                </div>
              </div>

              {/* Content Section */}
              <div className="relative px-8 py-12">
                <div className="grid lg:grid-cols-2 gap-8 items-center">
                  {/* Certificate Preview/Actions */}
                  <div className="space-y-6">
                    {certLoading && (
                      <div className="flex items-center justify-center p-8 bg-blue-50 rounded-2xl">
                        <div className="flex items-center space-x-3">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                          <span className="text-blue-600 font-medium">Preparing your certificate...</span>
                        </div>
                      </div>
                    )}

                    {certError && (
                      <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                        <div className="flex items-center space-x-2">
                          <span className="text-red-500">⚠️</span>
                          <span className="text-red-700 font-medium">{certError}</span>
                        </div>
                      </div>
                    )}

                    {certificate?.pdfUrl ? (
                      <a
                        href={certificate.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex items-center justify-center w-full px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                      >
                        <span className="mr-2 text-lg group-hover:animate-bounce">📄</span>
                        View & Download Certificate
                        <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    ) : (
                      <button
                        className="group inline-flex items-center justify-center w-full px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        onClick={createCertificate}
                        disabled={certLoading}
                      >
                        <span className="mr-2 text-lg group-hover:animate-pulse">✨</span>
                        {certLoading ? "Generating..." : "Generate Certificate"}
                        {!certLoading && (
                          <svg className="ml-2 w-5 h-5 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                        )}
                      </button>
                    )}
                  </div>

                  {/* Achievement Stats */}
                  <div className="space-y-6">
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
                      <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                        <span className="mr-2">📊</span>
                        Achievement Summary
                      </h4>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Lessons Completed</span>
                          <span className="font-bold text-green-600">{completedLessons}/{totalLessons}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Progress</span>
                          <span className="font-bold text-blue-600">{progressPercentage}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div 
                            className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-1000 ease-out"
                            style={{ width: `${progressPercentage}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    {certificate && (
                      <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl p-6 border border-amber-100">
                        <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                          <span className="mr-2">🔖</span>
                          Certificate Details
                        </h4>
                        <div className="space-y-3 text-sm">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Certificate No:</span>
                            <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                              {certificate.certificateNumber}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Issue Date:</span>
                            <span className="font-medium">
                              {certificate.issuedAt && new Date(certificate.issuedAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Footer Decoration */}
              <div className="relative h-4 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600">
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-pink-400 to-red-400 opacity-30"></div>
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-4 -left-4 w-8 h-8 bg-yellow-400 rounded-full animate-pulse opacity-70"></div>
            <div className="absolute -top-2 -right-6 w-6 h-6 bg-pink-400 rounded-full animate-pulse opacity-70 animation-delay-300"></div>
            <div className="absolute -bottom-4 -left-6 w-10 h-10 bg-blue-400 rounded-full animate-pulse opacity-70 animation-delay-700"></div>
            <div className="absolute -bottom-2 -right-4 w-4 h-4 bg-green-400 rounded-full animate-pulse opacity-70 animation-delay-500"></div>
          </div>
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
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center mb-4">
              <svg className="w-16 h-16 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Ready to Learn?</h3>
            <p className="text-gray-600 text-center max-w-md">
              Select a lesson from the sidebar to begin your learning journey
            </p>
          </div>
        )}
      </div>
    </div>
  );
}