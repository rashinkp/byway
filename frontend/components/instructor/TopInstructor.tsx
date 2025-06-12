import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils/cn";
import { Award, GraduationCap, Globe } from "lucide-react";

interface Instructor {
  id: string;
  areaOfExpertise: string;
  professionalExperience: string;
  about: string;
  website: string;
  education: string;
  certifications: string;
  totalStudents: number;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    avatar: string;
  };
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
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Top Instructors</h2>
          <p className="text-gray-500 mt-1">Learn from industry experts</p>
        </div>
        <Link href="/instructors">
          <Button variant="ghost" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
            View All Instructors
          </Button>
        </Link>
      </div>

      {/* Instructors Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {instructors.map((instructor) => (
          <div
            key={instructor.id}
            className="group bg-white rounded-xl border border-gray-100 hover:border-blue-100 hover:shadow-lg transition-all duration-300 overflow-hidden"
          >
            {/* Instructor Image */}
            <div className="relative h-48 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50 z-10" />
              <img
                src={instructor.user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(instructor.user.name)}&background=random`}
                alt={instructor.user.name}
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute bottom-4 left-4 right-4 z-20">
                <h3 className="text-lg font-semibold text-white mb-1">
                  {instructor.user.name}
                </h3>
                <p className="text-sm text-gray-200 line-clamp-1">
                  {instructor.areaOfExpertise}
                </p>
              </div>
            </div>

            {/* Instructor Details */}
            <div className="p-4">
              <div className="space-y-3">
                {/* Expertise */}
                <div className="flex items-start gap-2">
                  <Award className="w-4 h-4 text-blue-500 mt-1 flex-shrink-0" />
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {instructor.professionalExperience}
                  </p>
                </div>

                {/* Education */}
                {instructor.education && (
                  <div className="flex items-start gap-2">
                    <GraduationCap className="w-4 h-4 text-blue-500 mt-1 flex-shrink-0" />
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {instructor.education.split('\n')[0]}
                    </p>
                  </div>
                )}

                {/* Website */}
                {instructor.website && (
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-blue-500" />
                    <a 
                      href={instructor.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:text-blue-700 truncate"
                    >
                      {instructor.website.replace(/^https?:\/\//, '')}
                    </a>
                  </div>
                )}
              </div>
              
              <Link href={`/instructors/${instructor.user.id}`}>
                <Button 
                  variant="ghost" 
                  className="w-full mt-4 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                >
                  View Profile
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

