import { ILesson } from "@/types/lesson";
import { CheckCircle, Clock, FileText } from "lucide-react";

interface LessonWithCompletion extends ILesson {
  completed: boolean;
}

interface LessonContentProps {
  selectedLesson: LessonWithCompletion;
  content: any; // Replace with proper content type
  isContentLoading: boolean;
  isContentError: boolean;
  contentError: Error | null;
  currentLessonIndex: number;
  allLessons: LessonWithCompletion[];
  goToPrevLesson: () => void;
  goToNextLesson: () => void;
  markLessonComplete: () => void;
}

export function LessonContent({
  selectedLesson,
  content,
  isContentLoading,
  isContentError,
  contentError,
  currentLessonIndex,
  allLessons,
  goToPrevLesson,
  goToNextLesson,
  markLessonComplete,
}: LessonContentProps) {
  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 truncate">
          {selectedLesson.title}
        </h1>
        <div className="flex space-x-3">
          <button
            className="px-5 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 disabled:opacity-50 transition-colors"
            disabled={currentLessonIndex === 0}
            onClick={goToPrevLesson}
          >
            Previous
          </button>
          <button
            className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            disabled={
              currentLessonIndex === allLessons.length - 1 ||
              !selectedLesson.completed
            }
            onClick={goToNextLesson}
          >
            Next
          </button>
        </div>
      </div>
      <div className="bg-white shadow-xl rounded-xl overflow-hidden">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3 truncate">
            {selectedLesson.title}
          </h3>
          <p className="text-gray-600 leading-relaxed mb-4 line-clamp-2">
            {selectedLesson.description || "No description available."}
          </p>
        </div>
        {isContentLoading ? (
          <div className="p-6 text-gray-600">Loading content...</div>
        ) : isContentError ? (
          <div className="p-6 text-red-600">Error: {contentError?.message}</div>
        ) : !content ? (
          <div className="p-6 text-gray-600">No content available.</div>
        ) : (
          <>
            {content.type === "VIDEO" && (
              <div className="relative w-full max-w-[800px] mx-auto">
                <div
                  className="relative"
                  style={{
                    width: "800px",
                    height: "450px",
                  }}
                >
                  <video
                    controls
                    poster={content.thumbnailUrl || "/api/placeholder/800/450"}
                    className="w-full h-full rounded-lg object-cover"
                    style={{ objectFit: "cover" }}
                  >
                    <source
                      src={content.fileUrl ?? undefined}
                      type="video/mp4"
                    />
                    Your browser does not support the video tag.
                  </video>
                </div>
              </div>
            )}
            {content.type === "DOCUMENT" && (
              <div className="border-b border-gray-200">
                <div className="p-5 flex items-center justify-between">
                  <div className="flex items-center">
                    <FileText size={26} className="text-blue-600 mr-3" />
                    <span className="font-semibold text-gray-800">
                      Document
                    </span>
                  </div>
                </div>
                <div className="p-6 bg-gray-50">
                  <div className="border border-gray-200 rounded-lg p-5 bg-white min-h-64">
                    <img
                      src={content.thumbnailUrl || "/api/placeholder/800/600"}
                      alt="Document preview"
                      className="w-full object-contain mb-4 rounded"
                    />
                    <p className="text-gray-700 leading-relaxed">
                      {content.description || "No description available."}
                    </p>
                  </div>
                </div>
              </div>
            )}
            {content.type === "QUIZ" && (
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  Quiz: {content.title}
                </h3>
                <div className="space-y-4">
                  <div className="border border-gray-200 rounded-lg p-5">
                    <p className="font-medium text-gray-800 mb-3">
                      Sample Question: What is a key principle of UX design?
                    </p>
                    <div className="space-y-3">
                      {[
                        "Focus on aesthetics only",
                        "Prioritize user needs and usability",
                        "Minimize development time",
                        "Increase server performance",
                      ].map((option, idx) => (
                        <div key={idx} className="flex items-center">
                          <input
                            type="radio"
                            id={`option-${idx}`}
                            name="sample-question"
                            className="mr-2 accent-blue-600"
                          />
                          <label
                            htmlFor={`option-${idx}`}
                            className="text-gray-700"
                          >
                            {option}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
        <div className="p-6 border-t border-gray-200 bg-gray-50 flex justify-between items-center">
          <div className="flex items-center">
            {selectedLesson.completed ? (
              <>
                <CheckCircle size={22} className="text-green-600 mr-2" />
                <span className="text-green-600 font-medium">Completed</span>
              </>
            ) : (
              <>
                <Clock size={22} className="text-gray-500 mr-2" />
                <span className="text-gray-500 font-medium">Not completed</span>
              </>
            )}
          </div>
          <button
            className={`px-5 py-2 rounded-lg font-medium transition-colors ${
              selectedLesson.completed
                ? "bg-gray-200 text-gray-700 cursor-not-allowed"
                : "bg-green-600 text-white hover:bg-green-700"
            }`}
            onClick={markLessonComplete}
            disabled={selectedLesson.completed}
          >
            {selectedLesson.completed ? "Completed" : "Mark as Complete"}
          </button>
        </div>
      </div>
    </>
  );
}
