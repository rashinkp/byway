"use client";

import { useState, useEffect } from "react";
import {
  ChevronDown,
  ChevronUp,
  CheckCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
  FileText,
} from "lucide-react";
import { ILesson } from "@/types/lesson";
import { useGetAllLessonsInCourse } from "@/hooks/lesson/useGetAllLesson";
import { useGetContentByLessonId } from "@/hooks/content/useGetContentByLessonId";
import { useParams } from "next/navigation";

interface LessonWithCompletion extends ILesson {
  completed: boolean;
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

  // Fetch content for the selected lesson
  const {
    data: content,
    isLoading: isContentLoading,
    isError: isContentError,
    error: contentError,
  } = useGetContentByLessonId(selectedLesson?.id || "");

  // Initialize lessons with completion status
  useEffect(() => {
    if (data?.lessons) {
      const initializedLessons: LessonWithCompletion[] = data.lessons.map(
        (lesson) => ({
          ...lesson,
          completed: false,
        })
      );
      setLessonsWithCompletion(initializedLessons);
      if (initializedLessons.length > 0) {
        setSelectedLesson(initializedLessons[0]);
      } else {
        setSelectedLesson(null);
      }
    }
  }, [data]);

  const allLessons = lessonsWithCompletion;
  const currentLessonIndex = allLessons.findIndex(
    (lesson) => lesson.id === selectedLesson?.id
  );

  const handleLessonSelect = (lesson: LessonWithCompletion) => {
    setSelectedLesson(lesson);
  };

  const markLessonComplete = () => {
    // Implementation remains commented as in original
  };

  const goToNextLesson = () => {
    if (
      currentLessonIndex < allLessons.length - 1 &&
      selectedLesson?.completed
    ) {
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

  const completedLessons = allLessons.filter(
    (lesson) => lesson.completed
  ).length;
  const progressPercentage =
    allLessons.length > 0 ? (completedLessons / allLessons.length) * 100 : 0;

  return (
    <div className="flex flex-col lg:flex-row w-full bg-gray-100 min-h-screen">
      {/* Course Sidebar */}
      <div className="lg:w-80 bg-white shadow-lg lg:min-h-screen p-6 overflow-y-auto transition-all">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800">
            Introduction to User Experience Design
          </h2>
          <div className="mt-4">
            <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="absolute h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              {progressPercentage.toFixed(0)}% complete
            </p>
          </div>
        </div>

        {/* Lessons List */}
        <div className="space-y-2">
          {isLoading ? (
            <div className="p-4 text-gray-600">Loading lessons...</div>
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

        {/* Pagination Controls */}
        {data && data.totalPages > 1 && (
          <div className="mt-4 flex justify-between items-center">
            <button
              className="px-3 py-1 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 disabled:opacity-50 transition-colors"
              onClick={goToPreviousPage}
              disabled={page === 1}
            >
              <ChevronLeft size={20} />
            </button>
            <span className="text-sm text-gray-600">
              Page {data.page} of {data.totalPages}
            </span>
            <button
              className="px-3 py-1 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 disabled:opacity-50 transition-colors"
              onClick={goToNextPage}
              disabled={page === data.totalPages}
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="flex-1 p-6 lg:p-10">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500 text-lg">Loading...</p>
          </div>
        ) : isError ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-red-600 text-lg">Error: {error?.message}</p>
          </div>
        ) : selectedLesson ? (
          <div className="max-w-4xl mx-auto">
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

            {/* Lesson Content and Details */}
            <div className="bg-white shadow-xl rounded-xl overflow-hidden">
              {/* Lesson Details */}
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
                <div className="p-6 text-red-600">
                  Error: {contentError?.message}
                </div>
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
                          poster={
                            content.thumbnailUrl || "/api/placeholder/800/450"
                          }
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
                            src={
                              content.thumbnailUrl || "/api/placeholder/800/600"
                            }
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
                            Sample Question: What is a key principle of UX
                            design?
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

              {/* Completion Button */}
              <div className="p-6 border-t border-gray-200 bg-gray-50 flex justify-between items-center">
                <div className="flex items-center">
                  {selectedLesson.completed ? (
                    <>
                      <CheckCircle size={22} className="text-green-600 mr-2" />
                      <span className="text-green-600 font-medium">
                        Completed
                      </span>
                    </>
                  ) : (
                    <>
                      <Clock size={22} className="text-gray-500 mr-2" />
                      <span className="text-gray-500 font-medium">
                        Not completed
                      </span>
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

            {/* Lesson Navigation */}
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
                    selectedLesson.completed
                      ? "text-gray-700 hover:text-blue-600 cursor-pointer"
                      : "text-gray-400 cursor-not-allowed"
                  } transition-colors`}
                  onClick={
                    selectedLesson.completed ? goToNextLesson : undefined
                  }
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
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500 text-lg">Select a lesson to begin</p>
          </div>
        )}
      </div>

      {/* CSS for Animations and Video Player */}
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
