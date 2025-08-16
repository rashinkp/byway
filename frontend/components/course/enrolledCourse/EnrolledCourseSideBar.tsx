import { ILesson } from "@/types/lesson";
import { ChevronLeft, ChevronRight, CheckCircle } from "lucide-react";
import { LessonList } from "./EnrolledCourseLessonList";

interface LessonWithCompletion extends ILesson {
  completed: boolean;
  isLocked?: boolean;
  score?: number;
}

interface CourseSidebarProps {
  courseTitle: string;
  progressPercentage: number;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  allLessons: LessonWithCompletion[];
  selectedLesson: LessonWithCompletion | null;
  handleLessonSelect: (lesson: LessonWithCompletion) => void;
  data: {
    totalPages: number;
    page: number;
    [key: string]: unknown;
  } | null; // Pagination data
  page: number;
  goToPreviousPage: () => void;
  goToNextPage: () => void;
}

export function EnrolledCourseSidebar({
  courseTitle,
  progressPercentage,
  isLoading,
  isError,
  error,
  allLessons,
  selectedLesson,
  handleLessonSelect,
  data,
  page,
  goToPreviousPage,
  goToNextPage,
}: CourseSidebarProps) {
  return (
    <div className="lg:w-80 bg-white dark:bg-[#18181b] shadow-lg lg:min-h-screen p-6 overflow-y-auto transition-all">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-black dark:text-white">{courseTitle}</h2>
        <div className="mt-4">
          <div className="relative h-2 bg-gray-100 dark:bg-[#232323] rounded-full overflow-hidden">
            <div
              className="absolute h-full bg-gradient-to-r from-blue-400 to-indigo-500 dark:from-yellow-400 dark:to-yellow-500 transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-300 mt-2">
            {progressPercentage.toFixed(0)}% complete
          </p>
        </div>
      </div>
      <LessonList
        isLoading={isLoading}
        isError={isError}
        error={error}
        allLessons={allLessons.map(lesson => ({
          ...lesson,
          isLocked: lesson.isLocked
        }))}
        selectedLesson={selectedLesson}
        handleLessonSelect={handleLessonSelect}
      >
        {lesson => (
          <div className="flex items-center justify-between w-full">
            <span className="text-sm text-[var(--color-muted)] truncate">
              {lesson.title}
            </span>
            {lesson.completed && (
              <div className="flex items-center gap-2">
                {lesson.score !== undefined && (
                  <span className="text-xs font-medium px-2 py-1 rounded-full bg-[var(--color-primary-light)]/10 text-[var(--color-primary-light)]">
                    {lesson.score}%
                  </span>
                )}
                <CheckCircle className="w-4 h-4 text-[var(--color-primary-light)] flex-shrink-0" />
              </div>
            )}
          </div>
        )}
      </LessonList>
      {data && data.totalPages > 1 && (
        <div className="mt-4 flex justify-between items-center">
          <button
            className="px-3 py-1 border border-[var(--color-primary-light)]/40 rounded-lg text-[var(--color-muted)] hover:bg-[var(--color-primary-light)]/10 disabled:opacity-50 transition-colors"
            onClick={goToPreviousPage}
            disabled={page === 1}
          >
            <ChevronLeft size={20} />
          </button>
          <span className="text-sm text-[var(--color-muted)]">
            Page {data.page} of {data.totalPages}
          </span>
          <button
            className="px-3 py-1 border border-[var(--color-primary-light)]/40 rounded-lg text-[var(--color-muted)] hover:bg-[var(--color-primary-light)]/10 disabled:opacity-50 transition-colors"
            onClick={goToNextPage}
            disabled={page === data.totalPages}
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
}
