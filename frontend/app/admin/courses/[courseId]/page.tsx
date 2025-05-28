'use client';

import React, { useState } from "react";
import {
  Play,
  Clock,
  Users,
  Star,
  BookOpen,
  Award,
  CheckCircle,
  Globe,
  Calendar,
  User,
  ChevronDown,
  ChevronUp,
  PlayCircle,
  FileText,
  HelpCircle,
  Loader2,
} from "lucide-react";
import { useGetCourseById } from "@/hooks/course/useGetCourseById";
import { useGetAllLessonsInCourse } from "@/hooks/lesson/useGetAllLesson";
import { useGetContentByLessonId } from "@/hooks/content/useGetContentByLessonId";
import { useGetPublicUser } from "@/hooks/user/useGetPublicUser";
import { useApproveCourse, useDeclineCourse } from "@/hooks/course/useApproveCourse";
import { useSoftDeleteCourse } from "@/hooks/course/useSoftDeleteCourse";
import { useParams, useRouter } from "next/navigation";
import { ILesson,  } from "@/types/lesson";
import {  ContentType } from "@/types/content";

// Lesson Card Component
const LessonCard: React.FC<{
  lesson: ILesson;
  isExpanded: boolean;
  onToggle: () => void;
}> = ({ lesson, isExpanded, onToggle }) => {
  const { data: content } = useGetContentByLessonId(lesson.id);

  const getContentIcon = (type: ContentType) => {
    switch (type) {
      case "VIDEO":
        return <PlayCircle className="w-4 h-4" />;
      case "DOCUMENT":
        return <FileText className="w-4 h-4" />;
      case "QUIZ":
        return <HelpCircle className="w-4 h-4" />;
      default:
        return <BookOpen className="w-4 h-4" />;
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg">
      <button
        onClick={onToggle}
        className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            {content && content.type && getContentIcon(content.type)}
          </div>
          <div className="text-left">
            <h4 className="font-medium text-gray-900">
              {lesson.title}
            </h4>
            <p className="text-sm text-gray-500">
              {lesson.description}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">5 min</span>
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 text-gray-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-400" />
          )}
        </div>
      </button>

      {isExpanded && content && (
        <div className="px-4 pb-4 border-t border-gray-100">
          <div className="pt-4">
            <p className="text-sm text-gray-600 mb-2">
              {content.title}
            </p>
            {content.type === "VIDEO" && (
              <div className="flex items-center space-x-2 text-xs text-gray-500">
                <PlayCircle className="w-4 h-4" />
                <span>Video content</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const CourseDetails: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const courseId = params.courseId as string;
  const [expandedLessons, setExpandedLessons] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<
    "overview" | "curriculum" | "instructor" | "reviews"
  >("overview");

  const { data: courseData, isLoading: isCourseLoading, refetch: refetchCourse } = useGetCourseById(courseId);
  const { data: lessonsData, isLoading: isLessonsLoading } = useGetAllLessonsInCourse({
    courseId,
    limit: 100,
    sortBy: "order",
    sortOrder: "asc",
  });
  const { data: instructorData } = useGetPublicUser(courseData?.createdBy || '');
  const { mutate: approveCourse, isPending: isApproving } = useApproveCourse();
  const { mutate: declineCourse, isPending: isDeclining } = useDeclineCourse();
  const { mutate: toggleCourseStatus, isPending: isTogglingStatus } = useSoftDeleteCourse();

  const handleApprove = () => {
    if (!courseData) return;
    approveCourse({ courseId: courseData.id });
    refetchCourse();
  };

  const handleDecline = () => {
    if (!courseData) return;
    declineCourse({ courseId: courseData.id });
    refetchCourse();
  };

  const handleToggleStatus = () => {
    if (!courseData) return;
    toggleCourseStatus(courseData);
    refetchCourse();
  };

  const toggleLessonExpansion = (lessonId: string) => {
    setExpandedLessons((prev) =>
      prev.includes(lessonId)
        ? prev.filter((id) => id !== lessonId)
        : [...prev, lessonId]
    );
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "BEGINNER":
        return "bg-green-100 text-green-800";
      case "MEDIUM":
        return "bg-yellow-100 text-yellow-800";
      case "ADVANCED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (isCourseLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!courseData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Course Not Found</h2>
          <p className="text-gray-600">The course you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

  const discountPercentage = courseData.offer && courseData.price
    ? Math.round(
        ((courseData.price - courseData.offer) / courseData.price) * 100
      )
    : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-900 to-purple-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Course Info */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center space-x-2 text-blue-200">
                <span className="text-sm">Category ID: {courseData.categoryId}</span>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold leading-tight">
                {courseData.title}
              </h1>

              <p className="text-lg text-blue-100 leading-relaxed">
                {courseData.description || 'No description available'}
              </p>

              <div className="flex flex-wrap items-center gap-4 text-sm">
                {courseData.rating && (
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="font-semibold">{courseData.rating}</span>
                    <span className="text-blue-200">
                      ({courseData.reviewCount || 0} reviews)
                    </span>
                  </div>
                )}

                {courseData.lessons && (
                  <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4" />
                    <span>
                      {courseData.lessons} lessons
                    </span>
                  </div>
                )}

                {courseData.duration && (
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{courseData.duration} hours</span>
                  </div>
                )}

                {courseData.level && (
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${getLevelColor(
                      courseData.level
                    )}`}
                  >
                    {courseData.level}
                  </span>
                )}
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-gray-200">
                  {instructorData?.avatar && (
                    <img
                      src={instructorData.avatar}
                      alt={instructorData.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  )}
                </div>
                <div>
                  <p className="font-semibold">
                    {instructorData?.name || 'Unknown Instructor'}
                  </p>
                </div>
              </div>
            </div>

            {/* Course Preview Card */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-2xl overflow-hidden sticky top-8">
                {courseData.thumbnail && (
                  <div className="relative">
                    <img
                      src={courseData.thumbnail}
                      alt={courseData.title}
                      className="w-full h-48 object-cover"
                    />
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    {courseData.offer && courseData.price ? (
                      <div>
                        <span className="text-3xl font-bold text-gray-900">
                          ${courseData.offer}
                        </span>
                        <span className="text-lg text-gray-500 line-through ml-2">
                          ${courseData.price}
                        </span>
                        <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-semibold ml-2">
                          {discountPercentage}% OFF
                        </span>
                      </div>
                    ) : courseData.price ? (
                      <span className="text-3xl font-bold text-gray-900">
                        ${courseData.price}
                      </span>
                    ) : (
                      <span className="text-3xl font-bold text-gray-900">
                        Free
                      </span>
                    )}
                  </div>

                  <div className="space-y-3">
                    {courseData.approvalStatus === 'PENDING' && (
                      <>
                        <button 
                          onClick={handleApprove}
                          disabled={isApproving}
                          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isApproving ? (
                            <div className="flex items-center justify-center">
                              <Loader2 className="w-4 h-4 animate-spin mr-2" />
                              Approving...
                            </div>
                          ) : (
                            'Approve Course'
                          )}
                        </button>

                        <button 
                          onClick={handleDecline}
                          disabled={isDeclining}
                          className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isDeclining ? (
                            <div className="flex items-center justify-center">
                              <Loader2 className="w-4 h-4 animate-spin mr-2" />
                              Declining...
                            </div>
                          ) : (
                            'Decline Course'
                          )}
                        </button>
                      </>
                    )}

                    {courseData.approvalStatus === 'DECLINED' && (
                      <button 
                        onClick={handleApprove}
                        disabled={isApproving}
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isApproving ? (
                          <div className="flex items-center justify-center">
                            <Loader2 className="w-4 h-4 animate-spin mr-2" />
                            Approving...
                          </div>
                        ) : (
                          'Approve Course'
                        )}
                      </button>
                    )}

                    {courseData.approvalStatus === 'APPROVED' && (
                      <button 
                        onClick={handleToggleStatus}
                        disabled={isTogglingStatus}
                        className="w-full border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isTogglingStatus ? (
                          <div className="flex items-center justify-center">
                            <Loader2 className="w-4 h-4 animate-spin mr-2" />
                            Updating...
                          </div>
                        ) : (
                          courseData?.deletedAt ? 'Enable Course' : 'Disable Course'
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Course Content */}
          <div className="lg:col-span-2">
            {/* Navigation Tabs */}
            <div className="border-b border-gray-200 mb-8">
              <nav className="flex space-x-8">
                {[
                  { id: "overview", label: "Overview" },
                  { id: "curriculum", label: "Curriculum" },
                  { id: "instructor", label: "Instructor" },
                  { id: "reviews", label: "Status" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            {activeTab === "overview" && (
              <div className="space-y-8">
                {courseData.details?.longDescription && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                      About This Course
                    </h2>
                    <p className="text-gray-700 leading-relaxed mb-6">
                      {courseData.details.longDescription}
                    </p>
                  </div>
                )}

                {courseData.details?.objectives && (
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                      What You'll Learn
                    </h3>
                    <div className="bg-blue-50 p-6 rounded-lg">
                      <div className="whitespace-pre-line text-gray-700">
                        {courseData.details.objectives}
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {courseData.details?.prerequisites && (
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">
                        Prerequisites
                      </h3>
                      <p className="text-gray-700">
                        {courseData.details.prerequisites}
                      </p>
                    </div>
                  )}

                  {courseData.details?.targetAudience && (
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">
                        Target Audience
                      </h3>
                      <p className="text-gray-700">
                        {courseData.details.targetAudience}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "curriculum" && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Course Curriculum
                </h2>
                {isLessonsLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                  </div>
                ) : lessonsData?.lessons && lessonsData.lessons.length > 0 ? (
                  <>
                    <div className="bg-gray-100 p-4 rounded-lg mb-6">
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>{lessonsData.lessons.length} lessons</span>
                        <span>{typeof courseData.duration === 'number' ? courseData.duration : 0} hours total</span>
                      </div>
                    </div>

                    {lessonsData.lessons.map((lesson: ILesson) => (
                      <LessonCard
                        key={lesson.id}
                        lesson={lesson}
                        isExpanded={expandedLessons.includes(lesson.id)}
                        onToggle={() => toggleLessonExpansion(lesson.id)}
                      />
                    ))}
                  </>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No lessons available for this course yet.
                  </div>
                )}
              </div>
            )}

            {activeTab === "instructor" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Instructor Information
                </h2>
                {instructorData ? (
                  <div className="bg-white rounded-lg shadow-lg p-6">
                    <div className="flex items-start space-x-6">
                      <div className="flex-shrink-0">
                        <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden">
                          {instructorData.avatar && (
                            <img
                              src={instructorData.avatar}
                              alt={instructorData.name}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                      </div>
                      <div className="flex-1 space-y-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-xl font-semibold text-gray-900">
                              {instructorData.name}
                            </h3>
                            <p className="text-sm text-gray-500">
                              ID: {instructorData.id}
                            </p>
                          </div>
                          <button
                            onClick={() => router.push(`/admin/instructors/${instructorData.id}`)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            View Instructor Details
                          </button>
                        </div>

                        {instructorData.bio && (
                          <div>
                            <h4 className="text-sm font-medium text-gray-900 mb-1">Bio</h4>
                            <p className="text-gray-600">{instructorData.bio}</p>
                          </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {instructorData.education && (
                            <div>
                              <h4 className="text-sm font-medium text-gray-900 mb-1">Education</h4>
                              <p className="text-gray-600">{instructorData.education}</p>
                            </div>
                          )}

                          {instructorData.skills && (
                            <div>
                              <h4 className="text-sm font-medium text-gray-900 mb-1">Skills</h4>
                              <div className="flex flex-wrap gap-2">
                                {instructorData.skills.split(',').map((skill, index) => (
                                  <span
                                    key={index}
                                    className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs"
                                  >
                                    {skill.trim()}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {instructorData.country && (
                            <div>
                              <h4 className="text-sm font-medium text-gray-900 mb-1">Location</h4>
                              <p className="text-gray-600">
                                {instructorData.city && `${instructorData.city}, `}
                                {instructorData.country}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    Instructor details are not available at the moment.
                  </div>
                )}
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Course Status
                </h2>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        courseData.approvalStatus === 'APPROVED' 
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {courseData.approvalStatus}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Created At:</span>
                      <span className="text-gray-900">
                        {new Date(courseData.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Last Updated:</span>
                      <span className="text-gray-900">
                        {new Date(courseData.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar - Course Info */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Course Features
              </h3>

              <div className="space-y-3">
                {courseData.duration && (
                  <div className="flex items-center space-x-3">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {courseData.duration} hours on-demand video
                    </span>
                  </div>
                )}

                {lessonsData?.lessons && (
                  <div className="flex items-center space-x-3">
                    <BookOpen className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {lessonsData.lessons.length} lessons
                    </span>
                  </div>
                )}

                <div className="flex items-center space-x-3">
                  <Globe className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    Full lifetime access
                  </span>
                </div>

                <div className="flex items-center space-x-3">
                  <Award className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    Certificate of completion
                  </span>
                </div>

                {courseData.createdAt && (
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      Last updated:{" "}
                      {new Date(courseData.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
