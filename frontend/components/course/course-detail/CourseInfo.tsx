import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { BookOpen, Clock, Award, Star } from "lucide-react";
import { Course } from "@/types/course";
import { User, PublicUser } from "@/types/user";
import CourseInfoSkeleton from "./CourseInfoSkeleton";
import Link from "next/link";

interface CourseInfoProps {
  course: Course | undefined;
  instructor: (User | PublicUser) | undefined;
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

  // Ensure we always pass a number or undefined to formatPrice
  const offer = typeof course?.offer === 'number' ? course.offer : undefined;
  const price = typeof course?.price === 'number' ? course.price : undefined;

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
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
            {course?.title}
          </h1>
          <p className="text-gray-600">{course?.description}</p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            <BookOpen className="w-3 h-3 mr-1" />
            {lessonsLength || 0} Lessons
          </Badge>
          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
            <Clock className="w-3 h-3 mr-1" />
            {course?.duration || "N/A"}
          </Badge>
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <Award className="w-3 h-3 mr-1" />
            {course?.level || "All Levels"}
          </Badge>
          {course?.reviewStats && course.reviewStats.totalReviews > 0 ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                {renderStars(course.reviewStats.averageRating)}
              </div>
              <span className="text-sm font-medium text-gray-700">
                {course.reviewStats.averageRating.toFixed(1)}
              </span>
              <span className="text-sm text-gray-500">
                ({course.reviewStats.totalReviews} {course.reviewStats.totalReviews === 1 ? 'review' : 'reviews'})
              </span>
            </div>
          ) : (
            <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
              <Star className="w-3 h-3 mr-1" />
              No reviews yet
            </Badge>
          )}
        </div>

        {/* Rating Distribution */}
        {course?.reviewStats && course.reviewStats.totalReviews > 0 && (
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Rating Distribution</h3>
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((rating) => {
                const count = course.reviewStats?.ratingDistribution?.[rating] ?? 0;
                const percentage = course.reviewStats?.ratingPercentages?.[rating] ?? 0;
                return (
                  <div key={rating} className="flex items-center gap-3">
                    <div className="flex items-center gap-1 w-8">
                      <span className="text-sm text-gray-600">{rating}</span>
                      <Star className="w-3 h-3 text-yellow-400 fill-current" />
                    </div>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-600 w-12 text-right">
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <Separator />

        <div className="flex items-center gap-4">
          <Link 
            href={getInstructorLink(instructor?.id || '')}
            className="flex items-center gap-4 hover:bg-gray-50 p-2 rounded-lg transition-colors"
          >
            <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100">
              {instructor?.avatar ? (
                <img
                  src={instructor.avatar}
                  alt={instructor.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-blue-50 flex items-center justify-center text-blue-600 text-lg font-bold">
                  {instructor?.name?.charAt(0) || "I"}
                </div>
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Instructor</p>
              <p className="text-gray-900 hover:text-blue-600 transition-colors">{instructor?.name || "Anonymous"}</p>
            </div>
          </Link>
        </div>

      </div>
    </div>
  );
}
