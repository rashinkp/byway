import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { BookOpen, Clock, Award, Star, DollarSign, User } from "lucide-react";
import { Course } from "@/types/course";
import { User as UserType, PublicUser } from "@/types/user";
import CourseInfoSkeleton from "./CourseInfoSkeleton";
import Link from "next/link";

interface CourseInfoProps {
  course: Course | undefined;
  instructor: (UserType | PublicUser) | undefined;
  lessonsLength: number | undefined;
  courseLoading: boolean;
  instructorLoading: boolean;
  isEnrolled: boolean;
  userRole?: "USER" | "ADMIN" | "INSTRUCTOR";
}

export default function CourseInfo({
  course,
  instructor,
  lessonsLength,
  courseLoading,
  instructorLoading,
  isEnrolled,
  userRole = "USER",
}: CourseInfoProps) {

  if (courseLoading || instructorLoading) {
    return <CourseInfoSkeleton />;
  }

  const formatPrice = (price: number | string | null | undefined) => {
    if (!price) return "Free";
    const numPrice = typeof price === "string" ? parseFloat(price) : price;
    return `$${numPrice.toFixed(2)}`;
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? "text-yellow-400 fill-current" : "text-gray-300"
        }`}
      />
    ));
  };

  // Generate instructor link based on user role
  const getInstructorLink = (instructorId: string) => {
    switch (userRole) {
      case "ADMIN":
        return `/admin/instructors/${instructorId}`;
      case "INSTRUCTOR":
        return `/instructor/instructors/${instructorId}`;
      default:
        return `/instructors/${instructorId}`;
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm border border-gray-100 shadow-sm rounded-xl p-6">
      {/* Main Course Header */}
      <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {course?.title}
          </h1>
          <p className="text-lg text-gray-600 mb-4">
            {course?.description}
          </p>
        </div>

        {/* Course Meta Info */}
        <div className="flex flex-wrap items-center gap-4 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100">
              {instructor?.avatar ? (
                <img
                  src={instructor.avatar}
                  alt={instructor.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-blue-50 flex items-center justify-center text-blue-600 text-sm font-bold">
                  {instructor?.name?.charAt(0) || "I"}
                </div>
              )}
            </div>
            <div>
              <p className="text-sm text-gray-500">Instructor</p>
              <Link 
                href={getInstructorLink(instructor?.id || '')}
                className="text-sm font-medium text-gray-900 hover:text-blue-600 transition-colors"
              >
                {instructor?.name || "Anonymous"}
              </Link>
            </div>
          </div>

          {course?.reviewStats && course.reviewStats.totalReviews > 0 && (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                {renderStars(Math.round(course.reviewStats.averageRating))}
              </div>
              <span className="text-sm font-medium text-gray-700">
                {course.reviewStats.averageRating.toFixed(1)}
              </span>
              <span className="text-sm text-gray-500">
                ({course.reviewStats.totalReviews} {course.reviewStats.totalReviews === 1 ? 'review' : 'reviews'})
              </span>
            </div>
          )}
        </div>

        {/* Course Stats Badges */}
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            <BookOpen className="w-3 h-3 mr-1" />
            {lessonsLength || 0} Lessons
          </Badge>
          
          {course?.duration && (
            <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
              <Clock className="w-3 h-3 mr-1" />
              {course.duration} min
            </Badge>
          )}
          
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <Award className="w-3 h-3 mr-1" />
            {course?.level || "All Levels"}
          </Badge>

          {course?.price && (
            <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
              <DollarSign className="w-3 h-3 mr-1" />
              {formatPrice(course.price)}
              {course.offer && course.offer !== course.price && (
                <span className="ml-1 line-through text-gray-500">
                  {formatPrice(course.offer)}
                </span>
              )}
            </Badge>
          )}

          {!course?.reviewStats || course.reviewStats.totalReviews === 0 && (
            <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-200">
              <Star className="w-3 h-3 mr-1" />
              No reviews yet
            </Badge>
          )}
        </div>

        {/* Admin Info Section (only for admins) */}
        {userRole === "ADMIN" && course && (
          <>
            <Separator className="my-4" />
            <div className="bg-gray-50/50 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Admin Details</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                
                <div>
                  <span className="text-gray-500">Status:</span>
                  <p className={`font-medium ${
                    course.status === 'PUBLISHED' ? 'text-green-600' :
                    course.status === 'DRAFT' ? 'text-yellow-600' :
                    'text-gray-600'
                  }`}>
                    {course.status} / {course.approvalStatus}
                  </p>
                </div>
                <div>
                  <span className="text-gray-500">Admin Share:</span>
                  <p className="font-medium text-blue-600">{course.adminSharePercentage}%</p>
                </div>
                <div>
                  <span className="text-gray-500">Created:</span>
                  <p className="text-gray-900">{new Date(course.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}