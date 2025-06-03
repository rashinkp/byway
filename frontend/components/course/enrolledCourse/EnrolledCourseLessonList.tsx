import { ILesson } from "@/types/lesson";
import {  Lock } from "lucide-react";
import { LessonListSkeleton } from "./skeletons/LessonListSkeleton";

interface LessonWithCompletion extends ILesson {
  completed: boolean;
  isLocked?: boolean;
}

interface LessonListProps {
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  allLessons: LessonWithCompletion[];
  selectedLesson: LessonWithCompletion | null;
  handleLessonSelect: (lesson: LessonWithCompletion) => void;
}

export function LessonList({
  isLoading,
  isError,
  error,
  allLessons,
  selectedLesson,
  handleLessonSelect,
}: LessonListProps) {
  if (isLoading) {
    return <LessonListSkeleton />;
  }

  if (isError) {
    return (
      <div className="text-red-500 text-sm">
        {error?.message || "Failed to load lessons"}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {allLessons.map((lesson) => {
        const isSelected = selectedLesson?.id === lesson.id;
        const isLocked = lesson.isLocked;

        return (
          <button
            key={lesson.id}
            onClick={() => !isLocked && handleLessonSelect(lesson)}
            className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center gap-3 ${
              isSelected
                ? "bg-blue-50 text-blue-700 border border-blue-200"
                : isLocked
                ? "bg-gray-50 text-gray-400 cursor-not-allowed border border-gray-200"
                : "hover:bg-gray-50 border border-transparent"
            }`}
            disabled={isLocked}
          >
            {isLocked && <Lock className="w-4 h-4 flex-shrink-0" />}
            <span className="truncate flex-1">{lesson.title}</span>
            {lesson.completed && !isLocked && (
              <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                Completed
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
