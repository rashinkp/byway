'use client';

import { useState, useEffect } from 'react';
import {
  ChevronDown,
  ChevronUp,
  PlayCircle,
  FileText,
  CheckCircle,
  Clock,
} from 'lucide-react';

export default function CourseContent() {
  const [selectedLesson, setSelectedLesson] = useState<any>(null);

  
  const course = {
    id: 'course-1',
    title: 'Introduction to User Experience Design',
    description:
      'A comprehensive course covering the fundamentals of UX design principles, methodologies, and tools.',
    instructor: 'Sarah Parker',
    thumbnailUrl: '/api/placeholder/800/400',
    lessons: [
      {
        id: 'lesson-1',
        title: 'What is User Experience (UX) Design?',
        description:
          'An introduction to the core concepts and importance of UX design in modern digital products.',
        order: 1,
        status: 'PUBLISHED',
        content: {
          type: 'VIDEO',
          title: 'Understanding UX Design Fundamentals',
          description:
            'This video introduces the basic concepts of UX design and why it matters.',
          duration: '4 min',
          thumbnailUrl: '/api/placeholder/320/180',
          completed: false,
        },
      },
      {
        id: 'lesson-2-dynamic',
        title: 'Historical Overview of UX Design',
        description:
          'Exploring the evolution of UX design from early computing to modern digital experiences.',
        order: 2,
        status: 'PUBLISHED',
        content: {
          type: 'DOCUMENT',
          title: 'History of User Experience Design',
          description:
            'A comprehensive look at how UX has evolved over the decades.',
          duration: '4 min',
          thumbnailUrl: '/api/placeholder/320/180',
          completed: false,
        },
      },
      {
        id: 'lesson-3',
        title: 'Understanding User-Centered Design',
        description:
          'Learn about the philosophy and principles behind user-centered design approaches.',
        order: 3,
        status: 'PUBLISHED',
        content: {
          type: 'VIDEO',
          title: 'User-Centered Design Principles',
          description:
            'This video explains the core principles of designing with users at the center.',
          duration: '4 min',
          thumbnailUrl: '/api/placeholder/320/180',
          completed: false,
        },
      },
      {
        id: 'lesson-4',
        title: 'The Role of UX Design in Digital Products',
        description:
          'Examining how UX design shapes and enhances digital products and services.',
        order: 4,
        status: 'PUBLISHED',
        content: {
          type: 'VIDEO',
          title: 'UX Design’s Impact on Products',
          description:
            'Understanding the critical role UX plays in successful digital products.',
          duration: '4 min',
          thumbnailUrl: '/api/placeholder/320/180',
          completed: false,
        },
      },
      {
        id: 'lesson-5',
        title: 'Introduction to UX Design Tools and Techniques',
        description:
          'Overview of the essential tools and techniques used in modern UX design.',
        order: 5,
        status: 'PUBLISHED',
        content: {
          type: 'DOCUMENT',
          title: 'Essential UX Design Tools',
          description:
            'A guide to the most important tools in a UX designer’s toolkit.',
          duration: '4 min',
          thumbnailUrl: '/api/placeholder/320/180',
          completed: false,
        },
      },
    ],
    modules: [
      {
        id: 'module-1',
        title: 'Introduction to UX Design',
        lessonIds: ['lesson-1', 'lesson-2-dynamic', 'lesson-3', 'lesson-4', 'lesson-5'],
        expanded: true,
      },
    ],
  };

  // Find current lesson index for navigation
  const allLessons = course.lessons;
  const currentLessonIndex = allLessons.findIndex(
    (lesson) => lesson.id === selectedLesson?.id
  );

  // Handle module expansion
  const [expandedModules, setExpandedModules] = useState<{
    [key: string]: boolean;
  }>({
    'module-1': true,
  });

  const toggleModule = (moduleId: string) => {
    setExpandedModules({
      ...expandedModules,
      [moduleId]: !expandedModules[moduleId],
    });
  };

  // Select first lesson by default when component mounts
  useEffect(() => {
    if (allLessons.length > 0 && !selectedLesson) {
      setSelectedLesson(allLessons[0]);
    }
  }, [allLessons, selectedLesson]);

  // Content type icons
  const contentTypeIcon = (type: 'VIDEO' | 'DOCUMENT') => {
    switch (type) {
      case 'VIDEO':
        return <PlayCircle className="text-blue-600" size={20} />;
      case 'DOCUMENT':
        return <FileText className="text-green-600" size={20} />;
      default:
        return null;
    }
  };

  // Handler for lesson selection
  const handleLessonSelect = (lesson: any) => {
    setSelectedLesson(lesson);
  };

  // Mark lesson as complete
  const markLessonComplete = () => {
    if (!selectedLesson.content.completed) {
      setSelectedLesson({
        ...selectedLesson,
        content: { ...selectedLesson.content, completed: true },
      });
      allLessons[currentLessonIndex].content.completed = true;
    }
  };

  // Navigation to next and previous lessons
  const goToNextLesson = () => {
    if (
      currentLessonIndex < allLessons.length - 1 &&
      selectedLesson.content.completed
    ) {
      setSelectedLesson(allLessons[currentLessonIndex + 1]);
    }
  };

  const goToPrevLesson = () => {
    if (currentLessonIndex > 0) {
      setSelectedLesson(allLessons[currentLessonIndex - 1]);
    }
  };

  // Calculate progress
  const completedLessons = allLessons.filter(
    (lesson) => lesson.content.completed
  ).length;
  const progressPercentage = (completedLessons / allLessons.length) * 100;

  return (
    <div className="flex flex-col lg:flex-row w-full bg-gray-100 min-h-screen">
      {/* Course Sidebar */}
      <div className="lg:w-80 bg-white shadow-lg lg:min-h-screen p-6 overflow-y-auto transition-all">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800">
            {course.title}
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

        {/* Course Modules */}
        <div className="space-y-4">
          {course.modules.map((module) => (
            <div
              key={module.id}
              className="border border-gray-200 rounded-lg overflow-hidden"
            >
              <button
                className="w-full flex justify-between items-center p-4 font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 transition-colors"
                onClick={() => toggleModule(module.id)}
              >
                <span>{module.title}</span>
                {expandedModules[module.id] ? (
                  <ChevronUp size={20} className="text-gray-600" />
                ) : (
                  <ChevronDown size={20} className="text-gray-600" />
                )}
              </button>

              {expandedModules[module.id] && (
                <div className="border-t border-gray-200 animate-fade-in">
                  {course.lessons
                    .filter((lesson) => module.lessonIds.includes(lesson.id))
                    .map((lesson) => (
                      <button
                        key={lesson.id}
                        className={`w-full flex items-center p-4 text-left hover:bg-gray-50 border-l-4 transition-colors ${
                          selectedLesson?.id === lesson.id
                            ? 'border-blue-600 bg-blue-50'
                            : 'border-transparent'
                        }`}
                        onClick={() => handleLessonSelect(lesson)}
                      >
                        <div className="mr-3">
                          {lesson.content.completed ? (
                            <CheckCircle
                              size={20}
                              className="text-green-600"
                            />
                          ) : (
                            <Clock size={20} className="text-gray-400" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center text-sm font-medium text-gray-800">
                            {contentTypeIcon(lesson.content.type as 'VIDEO' | 'DOCUMENT')}
                            <span className="ml-2">{lesson.title}</span>
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {lesson.content.duration}
                          </div>
                        </div>
                      </button>
                    ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 p-6 lg:p-10">
        {selectedLesson ? (
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-gray-800">
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
                    !selectedLesson.content.completed
                  }
                  onClick={goToNextLesson}
                >
                  Next
                </button>
              </div>
            </div>

            {/* Lesson Content */}
            <div className="bg-white shadow-xl rounded-xl overflow-hidden">
              {selectedLesson.content.type === 'VIDEO' && (
                <div className="relative aspect-w-16 aspect-h-9 bg-black">
                  <img
                    src={selectedLesson.content.thumbnailUrl}
                    alt={selectedLesson.content.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button className="bg-blue-600 bg-opacity-90 rounded-full p-4 text-white hover:bg-opacity-100 transition-all">
                      <PlayCircle size={50} />
                    </button>
                  </div>
                </div>
              )}

              {selectedLesson.content.type === 'DOCUMENT' && (
                <div className="border-b border-gray-200">
                  <div className="p-5 flex items-center justify-between">
                    <div className="flex items-center">
                      <FileText size={26} className="text-blue-600 mr-3" />
                      <span className="font-semibold text-gray-800">
                        Document
                      </span>
                    </div>
                    <button className="text-blue-600 hover:text-blue-800 font-medium">
                      Download
                    </button>
                  </div>
                  <div className="p-6 bg-gray-50">
                    <div className="border border-gray-200 rounded-lg p-5 bg-white min-h-64">
                      <img
                        src="/api/placeholder/800/600"
                        alt="Document preview"
                        className="w-full object-contain mb-4 rounded"
                      />
                      <p className="text-gray-700 leading-relaxed">
                        {selectedLesson.content.description}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Lesson Description */}
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  {selectedLesson.content.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {selectedLesson.description}
                </p>
              </div>

              {/* Completion Button */}
              <div className="p-6 border-t border-gray-200 bg-gray-50 flex justify-between items-center">
                <div className="flex items-center">
                  {selectedLesson.content.completed ? (
                    <>
                      <CheckCircle
                        size={22}
                        className="text-green-600 mr-2"
                      />
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
                    selectedLesson.content.completed
                      ? 'bg-gray-200 text-gray-700 cursor-not-allowed'
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                  onClick={markLessonComplete}
                  disabled={selectedLesson.content.completed}
                >
                  {selectedLesson.content.completed
                    ? 'Completed'
                    : 'Mark as Complete'}
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
                  <span className="font-medium">
                    Previous: {allLessons[currentLessonIndex - 1].title}
                  </span>
                </div>
              ) : (
                <div></div>
              )}

              {currentLessonIndex < allLessons.length - 1 ? (
                <div
                  className={`flex items-center ${
                    selectedLesson.content.completed
                      ? 'text-gray-700 hover:text-blue-600 cursor-pointer'
                      : 'text-gray-400 cursor-not-allowed'
                  } transition-colors`}
                  onClick={
                    selectedLesson.content.completed ? goToNextLesson : undefined
                  }
                >
                  <span className="font-medium">
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