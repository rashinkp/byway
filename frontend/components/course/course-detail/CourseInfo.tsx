import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { BookOpen, Clock, Award, Star, DollarSign } from "lucide-react";
import { Course } from "@/types/course";
import { User as UserType, PublicUser } from "@/types/user";
import CourseInfoSkeleton from "./CourseInfoSkeleton";
import Image from 'next/image';

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



  return (
    <div className="bg-white dark:bg-[#232323] p-6">
      {/* Course Thumbnail */}
      <div className="flex justify-center mb-6">
        <div className="rounded-lg overflow-hidden">
          <Image src={course?.thumbnail || '/placeholder-course.jpg'} alt={course?.title || 'Course Thumbnail'} width={200} height={200} className="object-cover w-full h-full" />
        </div>
      </div>
      {/* Main Course Header */}
      <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-bold text-black dark:text-[#facc15] mb-2">
            {course?.title}
          </h1>
          <p className="text-lg text-gray-500 dark:text-gray-300 mb-4">
            {course?.description}
          </p>
        </div>

        {/* Course Meta Info */}
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="outline" className="bg-[var(--color-primary-light)]/10 text-[var(--color-primary-light)] border-[var(--color-primary-light)]/40">
            <BookOpen className="w-3 h-3 mr-1" />
            {lessonsLength || 0} Lessons
          </Badge>
          
          {course?.duration && (
            <Badge variant="outline" className="bg-[var(--color-accent)]/10 text-[var(--color-accent)] border-[var(--color-accent)]/40">
              <Clock className="w-3 h-3 mr-1" />
              {course.duration} min
            </Badge>
          )}
          
          <Badge variant="outline" className="bg-[var(--color-primary-light)]/10 text-[var(--color-primary-light)] border-[var(--color-primary-light)]/40">
            <Award className="w-3 h-3 mr-1" />
            {course?.level || "All Levels"}
          </Badge>

          {course?.price && (
            <Badge variant="outline" className="bg-[var(--color-warning)]/10 text-[var(--color-warning)] border-[var(--color-warning)]/40">
              <DollarSign className="w-3 h-3 mr-1" />
              {formatPrice(course.price)}
              {course.offer && course.offer !== course.price && (
                <span className="ml-1 line-through text-[var(--color-muted)]">
                  {formatPrice(course.offer)}
                </span>
              )}
            </Badge>
          )}

          {!course?.reviewStats || course.reviewStats.totalReviews === 0 && (
            <Badge variant="outline" className="bg-[var(--color-surface)] text-[var(--color-muted)] border-[var(--color-primary-light)]/20">
              <Star className="w-3 h-3 mr-1" />
              No reviews yet
            </Badge>
          )}
        </div>

        {/* Admin Info Section (only for admins) */}
        {userRole === "ADMIN" && course && (
          <>
            <Separator className="my-4" />
            <div className="bg-[var(--color-background)] rounded-lg p-4">
              <h4 className="text-sm font-semibold text-[var(--color-primary-dark)] mb-3">Admin Details</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                
                <div>
                  <span className="text-[var(--color-muted)]">Status:</span>
                  <p className={`font-medium ${
                    course.status === 'PUBLISHED' ? 'text-[var(--color-primary-light)]' :
                    course.status === 'DRAFT' ? 'text-[var(--color-warning)]' :
                    'text-[var(--color-muted)]'
                  }`}>
                    {course.status} / {course.approvalStatus}
                  </p>
                </div>
                <div>
                  <span className="text-[var(--color-muted)]">Admin Share:</span>
                  <p className="font-medium text-[var(--color-primary-light)]">{course.adminSharePercentage}%</p>
                </div>
                <div>
                  <span className="text-[var(--color-muted)]">Created:</span>
                  <p className="text-[var(--color-primary-dark)]">{new Date(course.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}