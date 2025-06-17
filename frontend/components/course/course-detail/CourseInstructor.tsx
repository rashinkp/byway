import { User, PublicUser } from "@/types/user";
import CourseInstructorSkeleton from "./CourseInstructorSkeleton";
import Link from "next/link";

interface CourseInstructorProps {
  instructor: (User | PublicUser) | undefined;
  isLoading: boolean;
  userRole?: "USER" | "ADMIN" | "INSTRUCTOR";
}

export default function CourseInstructor({
  instructor,
  isLoading,
  userRole = "USER",
}: CourseInstructorProps) {
  if (isLoading) {
    return <CourseInstructorSkeleton />;
  }
  if (!instructor) return null;

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
    <Link href={getInstructorLink(instructor.id)} className="block hover:bg-gray-50 transition-colors rounded-lg">
      <div className="space-y-8">
        <div className="flex items-start space-x-6">
          <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100">
            {instructor?.avatar ? (
              <img
                src={instructor.avatar}
                alt={instructor.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-blue-50 flex items-center justify-center text-blue-600 text-xl font-bold">
                {instructor?.name?.charAt(0) || "I"}
              </div>
            )}
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-900 hover:text-blue-600 transition-colors">{instructor?.name}</h2>
            {'email' in instructor && instructor.email && (
              <p className="text-gray-600 mt-1">{instructor.email}</p>
            )}
            <div className="mt-4 space-y-2">
              <p className="text-sm text-gray-600">{instructor?.bio}</p>
              <p className="text-sm text-gray-600">{instructor?.education}</p>
              <p className="text-sm text-gray-600">{instructor?.skills}</p>
              <p className="text-sm text-gray-600">{instructor?.country}, {instructor?.city}</p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
