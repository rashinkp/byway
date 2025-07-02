"use client";
import { cn } from "@/utils/cn";
import { Star,} from "lucide-react";
import { useRouter } from "next/navigation";
import { Course } from "@/types/course";

interface CourseCardProps {
  course: Course;
  className?: string;
}

export function CourseCard({
  course,
  className,
}: CourseCardProps) {
  const router = useRouter();



  const handleCardClick = () => {
    router.push(`/courses/${course.id}`);
  };


  return (
    <div
      className={cn(
        "rounded-2xl shadow-lg cursor-pointer overflow-hidden hover:shadow-xl transition-shadow duration-300 ",
        className
      )}
      style={{ background: "var(--color-surface)", color: "var(--color-primary-dark)", height: "400px", minHeight: "400px" }}
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
    >
      {/* Hero Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={course.thumbnail || "/placeHolder.jpg"}
          alt={course.title}
          className="w-full h-full object-cover"
        />
      </div>
      {/* Content */}
      <div className="p-6 flex flex-col">
        {/* Profile Section */}
        <div className="flex items-center gap-2 mb-3">
          <img
            src={(course.instructor && 'profileImage' in course.instructor && (course.instructor as any).profileImage) || "/UserProfile.jpg"}
            alt={course.instructor?.name || "Instructor"}
            className="w-9 h-9 rounded-full object-cover"
          />
          <div>
             <h3 className="font-medium text-sm text-[var(--color-primary-dark)]">{course.instructor?.name || "Unknown"}</h3>
             <p className="text-xs text-[var(--color-primary-light)]">{(course.instructor && 'role' in course.instructor && (course.instructor as any).role) || "Instructor"}</p>
          </div>
        </div>
        {/* Title */}
        <h2 className="text-xl font-bold mb-1 line-clamp-1" style={{ color: "var(--foreground)" }}>
          <span className="text-[var(--color-primary-dark)]">{course.title}</span>
        </h2>
        {/* Description */}
        <p className="text-sm mb-1 leading-relaxed line-clamp-2 text-[var(--color-primary-light)]">
          {course.description || "No description available."}
        </p>
        {/* Rating */}
        <div className="flex items-center gap-2 mt-1">
          <span className="text-2xl font-bold text-[var(--color-primary-dark)]">
            {course.reviewStats?.averageRating?.toFixed(1) || "0.0"}
          </span>
          <Star className="w-5 h-5 text-[var(--color-primary-light)]" />
          <span className="text-sm text-[var(--color-primary-light)]">
            ({course.reviewStats?.totalReviews || 0} reviews)
          </span>
        </div>
      </div>
    </div>
  );
}
