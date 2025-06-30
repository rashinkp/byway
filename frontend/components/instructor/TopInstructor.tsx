import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils/cn";
import AnalyticsCard from "@/components/common/AnalyticsCard";

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
    <div className={cn(className)}>
      {/* Instructors Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {instructors.map((instructor) => (
          <AnalyticsCard
            key={instructor.id}
            imageUrl={
              instructor.user.avatar ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(instructor.user.name)}&background=random`
            }
            profileImage={""}
            profileName={""}
            profileRole={""}
            title={instructor.user.name}
            description={instructor.professionalExperience}
            subtitle={instructor.areaOfExpertise}
            rating={undefined}
            reviewCount={undefined}
            footer={undefined}
          />
        ))}
      </div>
    </div>
  );
}

