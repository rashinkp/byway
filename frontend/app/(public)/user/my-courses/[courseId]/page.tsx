'use client';

import { useState, useEffect } from 'react';
import {
  ChevronDown,
  ChevronUp,
  CheckCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { ILesson, LessonStatus } from '@/types/lesson';
import { useGetAllLessonsInCourse } from '@/hooks/lesson/useGetAllLesson';
import { useParams } from 'next/navigation';

interface LessonWithCompletion extends ILesson {
  completed: boolean;
}

export default function CourseContent() {
  // Currently selected lesson
  const [selectedLesson, setSelectedLesson] = useState<LessonWithCompletion | null>(null);
  // Track lesson completion status
  const [lessonsWithCompletion, setLessonsWithCompletion] = useState<LessonWithCompletion[]>([]);
  // Current page for pagination
  const [page, setPage] = useState(1);
  const limit = 10; // Number of lessons per page

  const params = useParams();
  const courseId = params.courseId as string;

  // Fetch lessons using the hook
  const { data, isLoading, isError, error } = useGetAllLessonsInCourse({
    courseId,
    page,
    limit,
    sortBy: 'order',
    sortOrder: 'asc',
    filterBy: 'PUBLISHED',
    includeDeleted: false,
  });

  // Initialize lessons with completion status
  useEffect(() => {
    if (data?.lessons) {
      const initializedLessons: LessonWithCompletion[] = data.lessons.map((lesson) => ({
        ...lesson,
        completed: false, // Simulate completion status
      }));
      setLessonsWithCompletion(initializedLessons);
      // Select first lesson by default or reset if page changes
      if (initializedLessons.length > 0) {
        setSelectedLesson(initializedLessons[0]);
      } else {
        setSelectedLesson(null);
      }
    }
  }, [data]);

  // Find current lesson index for navigation
  const allLessons = lessonsWithCompletion;
  const currentLessonIndex = allLessons.findIndex(
    (lesson) => lesson.id === selectedLesson?.id
  );

  // Handler for lesson selection
  const handleLessonSelect = (lesson: LessonWithCompletion) => {
    setSelectedLesson(lesson);
  };

  // Mark lesson as complete
  const markLessonComplete = () => {
    // if (!selectedLesson?.completed) {
    //   const updatedLessons = lessonsWithCompletion.map((lesson, index) =>
    //     index === currentLessonIndex ? { ...lesson, completed: true } : lesson
    //   );
    //   setLessonsWithCompletion(updatedLessons);
    //   setSelectedLesson({ ...selectedLesson, completed: true });
    // }
  };

  // Navigation to next and previous lessons
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

  // Pagination controls
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

  // Calculate progress
  const completedLessons = allLessons.filter((lesson) => lesson.completed).length;
  const progressPercentage = allLessons.length > 0 ? (completedLessons / allLessons.length) * 100 : 0;

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
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-800 truncate">
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

            {/* Lesson Details */}
            <div className="bg-white shadow-xl rounded-xl overflow-hidden">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3 truncate">
                  {selectedLesson.title}
                </h3>
                <p className="text-gray-600 leading-relaxed mb-4 line-clamp-2">
                  {selectedLesson.description || "No description available."}
                </p>
                <div className="text-sm text-gray-500">
                  <p>
                    <span className="font-medium">Status:</span>{" "}
                    {selectedLesson.status}
                  </p>
                  <p>
                    <span className="font-medium">Order:</span>{" "}
                    {selectedLesson.order}
                  </p>
                  <p>
                    <span className="font-medium">Created At:</span>{" "}
                    {new Date(selectedLesson.createdAt).toLocaleDateString()}
                  </p>
                  <p>
                    <span className="font-medium">Updated At:</span>{" "}
                    {new Date(selectedLesson.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

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
                  <ChevronUp
                    className="rotate- Boston Lessons90 mr-2"
                    size={20}
                  />
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

      {/* CSS for Animations */}
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
      `}</style>
    </div>
  );
}