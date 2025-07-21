import { ILesson } from "@/types/lesson";
import {  CheckCircle } from "lucide-react";
import { LessonListSkeleton } from "./skeletons/LessonListSkeleton";
import { IQuizAnswer } from "@/types/progress";
import ErrorDisplay from "@/components/ErrorDisplay";

interface LessonWithCompletion extends ILesson {
  completed: boolean;
  isLocked?: boolean;
  score?: number;
  totalQuestions?: number;
  answers?: IQuizAnswer[];
}

interface LessonListProps {
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  allLessons: LessonWithCompletion[];
  selectedLesson: LessonWithCompletion | null;
  handleLessonSelect: (lesson: LessonWithCompletion) => void;
  children?: (lesson: LessonWithCompletion) => React.ReactNode;
}

export function LessonList({
  isLoading,
  isError,
  error,
  allLessons,
  selectedLesson,
  handleLessonSelect,
  children
}: LessonListProps) {
  if (isLoading) {
    return <LessonListSkeleton />;
  }

  if (isError) {
    return (
      <ErrorDisplay error={error} title="Lesson List Error" description="Failed to load lessons." />
    );
  }

  return (
    <div className="space-y-1">
      {allLessons.map((lesson) => (
        <button
          key={lesson.id}
          onClick={() => handleLessonSelect(lesson)}
          disabled={lesson.isLocked}
          className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
            selectedLesson?.id === lesson.id
              ? "bg-blue-100 dark:bg-yellow-100/10 text-blue-600 dark:text-yellow-400"
              : "hover:bg-gray-100 dark:hover:bg-[#232323]"
          } ${lesson.isLocked ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {children ? children(lesson) : (
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500 dark:text-gray-300 truncate">
                {lesson.title}
              </span>
              {lesson.completed && (
                <CheckCircle className="w-4 h-4 text-blue-500 dark:text-yellow-400" />
              )}
            </div>
          )}
        </button>
      ))}
    </div>
  );
}
