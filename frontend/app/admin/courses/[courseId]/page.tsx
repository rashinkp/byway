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
  Edit2,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Briefcase,
  Shield,
  CheckCircle2,
  AlertCircle,
  UserCircle,
  TrendingUp,
  DollarSign,
  Percent,
} from "lucide-react";
import { useGetCourseById } from "@/hooks/course/useGetCourseById";
import { useGetAllLessonsInCourse } from "@/hooks/lesson/useGetAllLesson";
import { useGetContentByLessonId } from "@/hooks/content/useGetContentByLessonId";
import { useGetPublicUser } from "@/hooks/user/useGetPublicUser";
import { useApproveCourse, useDeclineCourse } from "@/hooks/course/useApproveCourse";
import { useSoftDeleteCourse } from "@/hooks/course/useSoftDeleteCourse";
import { useParams, useRouter } from "next/navigation";
import { ILesson } from "@/types/lesson";
import { ContentType } from "@/types/content";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

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

  if (isCourseLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (!courseData) {
    return (
      <div className="text-center py-8">
        <div className="text-red-600 mb-2">Course Not Found</div>
        <p className="text-gray-600">The course you're looking for doesn't exist or has been removed.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <Card className="bg-white/80 backdrop-blur-sm border border-gray-100 shadow-sm rounded-xl p-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="flex items-center gap-6">
              <div className="relative">
                {courseData.thumbnail ? (
                  <div className="w-20 h-20 rounded-xl overflow-hidden">
                    <img 
                      src={courseData.thumbnail} 
                      alt={`${courseData.title}'s thumbnail`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-20 h-20 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 text-2xl font-bold">
                    {courseData.title ? courseData.title[0].toUpperCase() : "C"}
                  </div>
                )}
                {courseData.approvalStatus === 'APPROVED' && (
                  <div className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-1.5">
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <h1 className="text-2xl font-semibold text-gray-900">{courseData.title}</h1>
                <p className="text-gray-600">Category ID: {courseData.categoryId}</p>
                <div className="flex items-center gap-3">
                  <Badge 
                    variant="outline"
                    className="capitalize bg-blue-50 text-blue-700 border-blue-200"
                  >
                    <Shield className="w-3 h-3 mr-1" />
                    {courseData.level?.toLowerCase() || 'Not specified'}
                  </Badge>
                  <Badge 
                    variant="outline"
                    className={courseData.approvalStatus === 'APPROVED' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-orange-50 text-orange-700 border-orange-200'}
                  >
                    {courseData.approvalStatus === 'APPROVED' ? (
                      <>
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Approved
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-3 h-3 mr-1" />
                        {courseData.approvalStatus}
                      </>
                    )}
                  </Badge>
                  <Badge 
                    variant="outline"
                    className="bg-purple-50 text-purple-700 border-purple-200"
                  >
                    <Clock className="w-3 h-3 mr-1" />
                    {courseData.duration || 0} hours
                  </Badge>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              {courseData.approvalStatus === 'PENDING' && (
                <>
                  <Button 
                    onClick={handleApprove}
                    disabled={isApproving}
                    size="lg"
                    variant="outline"
                    className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                  >
                    {isApproving ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                    )}
                    Approve
                  </Button>
                  <Button 
                    onClick={handleDecline}
                    disabled={isDeclining}
                    size="lg"
                    variant="outline"
                    className="bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
                  >
                    {isDeclining ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <AlertCircle className="w-4 h-4 mr-2" />
                    )}
                    Decline
                  </Button>
                </>
              )}
              {courseData.approvalStatus === 'APPROVED' && (
                <Button 
                  onClick={handleToggleStatus}
                  disabled={isTogglingStatus}
                  size="lg"
                  variant="outline"
                  className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
                >
                  {isTogglingStatus ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Edit2 className="w-4 h-4 mr-2" />
                  )}
                  {courseData?.deletedAt ? 'Enable Course' : 'Disable Course'}
                </Button>
              )}
            </div>
          </div>
        </Card>

        {/* Main Content Section */}
        <Card className="bg-white/80 backdrop-blur-sm border border-gray-100 shadow-sm rounded-xl overflow-hidden">
          <div className="p-6 space-y-6">
            {/* Course Details */}
            <div className="flex items-center gap-2 text-gray-900">
              <BookOpen className="w-5 h-5" />
              <h2 className="text-lg font-semibold">Course Details</h2>
            </div>
            <Separator />
            <div>
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">Description</h3>
              <p className="text-gray-800 leading-relaxed">
                {courseData.description || (
                  <span className="italic text-gray-400">
                    No description provided yet
                  </span>
                )}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <div className="bg-blue-50 p-2 rounded-lg">
                  <DollarSign className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">Price</h3>
                  <p className="text-gray-800">
                    {courseData.price ? `$${courseData.price}` : (
                      <span className="italic text-gray-400">Not specified</span>
                    )}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-blue-50 p-2 rounded-lg">
                  <Percent className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">Offer Price</h3>
                  <p className="text-gray-800">
                    {courseData.offer ? `$${courseData.offer}` : (
                      <span className="italic text-gray-400">No offer</span>
                    )}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-blue-50 p-2 rounded-lg">
                  <Percent className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">Your Share</h3>
                  <p className="text-gray-800">
                    {`${100 - (courseData?.instructorSharePercentage ?? 0)}%`}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-blue-50 p-2 rounded-lg">
                  <Percent className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">Admin Share</h3>
                  <p className="text-gray-800">
                    {`${courseData?.adminSharePercentage || 0}%`}
                  </p>
                </div>
              </div>
            </div>

            {courseData.details?.longDescription && (
              <div className="flex items-start gap-3">
                <div className="bg-blue-50 p-2 rounded-lg">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">Long Description</h3>
                  <p className="text-gray-800">
                    {courseData.details.longDescription}
                  </p>
                </div>
              </div>
            )}

            {/* Course Curriculum */}
            <div className="flex items-center gap-2 text-gray-900">
              <Play className="w-5 h-5" />
              <h2 className="text-lg font-semibold">Course Curriculum</h2>
            </div>
            <Separator />
            {isLessonsLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              </div>
            ) : lessonsData?.lessons && lessonsData.lessons.length > 0 ? (
              <div className="space-y-4">
                {lessonsData.lessons.map((lesson: ILesson) => (
                  <LessonCard
                    key={lesson.id}
                    lesson={lesson}
                    isExpanded={expandedLessons.includes(lesson.id)}
                    onToggle={() => toggleLessonExpansion(lesson.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No lessons available for this course yet.
              </div>
            )}

            {/* Course Status */}
            <div className="flex items-center gap-2 text-gray-900">
              <CheckCircle className="w-5 h-5" />
              <h2 className="text-lg font-semibold">Course Status</h2>
            </div>
            <Separator />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <div className="bg-blue-50 p-2 rounded-lg">
                  <Calendar className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-500 mb-1">Created At</p>
                  <p className="text-gray-800">
                    {new Date(courseData.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-blue-50 p-2 rounded-lg">
                  <Calendar className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-500 mb-1">Last Updated</p>
                  <p className="text-gray-800">
                    {new Date(courseData.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default CourseDetails;
