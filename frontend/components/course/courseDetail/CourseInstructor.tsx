import UserProfile from "@/public/UserProfile.jpg";
import { Star, Users, BookOpen } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

interface CourseInstructorProps {
  instructor: any;
  isLoading: boolean;
}

export default function CourseInstructor({
  instructor,
  isLoading,
}: CourseInstructorProps) {
  if (isLoading) {
    return (
      <div className="py-4">
        <LoadingSpinner size="sm" text="Loading instructor details..." />
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Instructor</h2>
      <div className="flex items-start gap-4 mb-6">
        <img
          src={instructor?.avatar || UserProfile.src}
          alt={instructor?.name}
          className="w-16 h-16 rounded-full"
        />
        <div>
          <h3 className="text-lg font-bold text-blue-600">
            {instructor?.name}
          </h3>
          <p className="text-gray-600 mb-2">{instructor?.bio}</p>
          <div className="flex flex-wrap gap-4 mb-4">
            <div className="flex items-center gap-1">
              <Star size={16} />
              <span>40,440 Reviews</span>
            </div>
            <div className="flex items-center gap-1">
              <Users size={16} />
              <span>500 Students</span>
            </div>
            <div className="flex items-center gap-1">
              <BookOpen size={16} />
              <span>15 Courses</span>
            </div>
          </div>
          <p className="text-gray-700">{instructor?.bio}</p>
        </div>
      </div>
    </div>
  );
}
