import Link  from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils/cn";

interface Instructor {
  image: string;
  name: string;
  role: string;
  courseCount: number;
}

interface TopInstructorsProps {
  instructors: Instructor[];
  className?: string;
}

export function TopInstructors({
  instructors,
  className,
}: TopInstructorsProps) {
  return (
    <div className={cn("p-6", className)}>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-gray-800">Top Instructors</h2>
        <Link href="/instructors">
          <span className="text-sm font-medium text-blue-600 hover:text-blue-700 cursor-pointer">
            See All
          </span>
        </Link>
      </div>

      {/* Instructors Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2">
        {instructors.map((instructor, index) => (
          <div
            key={index}
            className="bg-white shadow-sm rounded-xl border border-gray-100 hover:shadow-lg transition-all duration-300 flex flex-col items-center p-3 w-full max-w-[180px] mx-auto"
          >
            {/* Instructor Image */}
            <div className="w-16 h-16 rounded-full overflow-hidden mb-3 border-2 border-gray-200">
              <img
                src={instructor.image}
                alt={instructor.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Instructor Details */}
            <h3 className="text-sm font-semibold text-gray-800 mb-1 line-clamp-1">
              {instructor.name}
            </h3>
            <p className="text-xs text-gray-500 mb-1 line-clamp-1">
              {instructor.role}
            </p>
            <p className="text-xs text-gray-600 mb-3">
              {instructor.courseCount} Courses
            </p>

           
          </div>
        ))}
      </div>
    </div>
  );
}

