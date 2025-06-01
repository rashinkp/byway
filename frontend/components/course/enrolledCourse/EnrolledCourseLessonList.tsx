import { ILesson } from "@/types/lesson";
import { CheckCircle, Clock } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

interface LessonWithCompletion extends ILesson {
  completed: boolean;
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
  return (
    <div className="space-y-2">
      {isLoading ? (
        <div className="p-4">
          <LoadingSpinner 
            size="sm" 
            text="Loading lessons..." 
            className="h-[100px]"
          />
        </div>
      ) : isError ? (
        <div className="p-4 text-red-600">Error: {error?.message}</div>
      ) : allLessons.length === 0 ? (
        <div className="p-4 text-gray-600">No lessons found.</div>
      ) : (
        allLessons.map((lesson) => (
          <button
            key={lesson.id}
            className={`w-full flex items-center p-4 text-left hover:bg-gray-50 border-l-4 transition-colors ${
              selectedLesson?.id === lesson.id
                ? "border-blue-600 bg-blue-50"
                : "border-transparent"
            }`}
            onClick={() => handleLessonSelect(lesson)}
          >
            <div className="mr-3">
              {lesson.completed ? (
                <CheckCircle size={20} className="text-green-600" />
              ) : (
                <Clock size={20} className="text-gray-400" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-gray-800 truncate max-w-[220px]">
                {lesson.title}
              </div>
              <div className="text-xs text-gray-500 mt-1 line-clamp-2">
                {lesson.description || "No description available."}
              </div>
            </div>
          </button>
        ))
      )}
    </div>
  );
}
