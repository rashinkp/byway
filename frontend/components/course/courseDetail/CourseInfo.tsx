import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { BookOpen, Clock, Users, Award, Star } from "lucide-react";
import { Course } from "@/types/course";
import { User } from "@/types/user";
import CourseInfoSkeleton from "./CourseInfoSkeleton";
import Link from "next/link";

interface CourseInfoProps {
  course: Course | undefined;
  instructor: User | undefined;
  lessonsLength: number | undefined;
  courseLoading: boolean;
  instructorLoading: boolean;
  isEnrolled: boolean;
}

export default function CourseInfo({
  course,
  instructor,
  lessonsLength,
  courseLoading,
  instructorLoading,
  isEnrolled,
}: CourseInfoProps) {

  if (courseLoading || instructorLoading) {
    return <CourseInfoSkeleton />;
  }

  // Ensure we always pass a number or undefined to formatPrice
  const offer = typeof course?.offer === 'number' ? course.offer : undefined;
  const price = typeof course?.price === 'number' ? course.price : undefined;

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
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            <Star className="w-3 h-3 mr-1" />
            {course?.rating || "No ratings"}
          </Badge>
        </div>

        <Separator />

        <div className="flex items-center gap-4">
          <Link 
            href={`/instructors/${instructor?.id}`}
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
