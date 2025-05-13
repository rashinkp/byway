import {
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { ILesson } from "@/types/lesson";

interface LessonWithCompletion extends ILesson {
  completed: boolean;
}

interface LessonNavigationProps {
  currentLessonIndex: number;
  allLessons: LessonWithCompletion[];
  selectedLesson: LessonWithCompletion | null;
  goToPrevLesson: () => void;
  goToNextLesson: () => void;
}

export function LessonNavigation({
  currentLessonIndex,
  allLessons,
  selectedLesson,
  goToPrevLesson,
  goToNextLesson,
}: LessonNavigationProps) {
  return (
    <div className="mt-10 flex justify-between">
      {currentLessonIndex > 0 ? (
        <div
          className="flex items-center text-gray-700 hover:text-blue-600 cursor-pointer transition-colors"
          onClick={goToPrevLesson}
        >
          <ChevronUp className="rotate-90 mr-2" size={20} />
          <span className="font-medium truncate">
            Previous: {allLessons[currentLessonIndex - 1].title}
          </span>
        </div>
      ) : (
        <div></div>
      )}
      {currentLessonIndex < allLessons.length - 1 ? (
        <div
          className={`flex items-center ${
            selectedLesson?.completed
              ? "text-gray-700 hover:text-blue-600 cursor-pointer"
              : "text-gray-400 cursor-not-allowed"
          } transition-colors`}
          onClick={selectedLesson?.completed ? goToNextLesson : undefined}
        >
          <span className="font-medium truncate">
            Next: {allLessons[currentLessonIndex + 1].title}
          </span>
          <ChevronDown className="-rotate-90 ml-2" size={20} />
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
}
