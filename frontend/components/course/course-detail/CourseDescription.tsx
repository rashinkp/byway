import { Course } from "@/types/course";
import { Check } from "lucide-react";

interface CourseDescriptionProps {
  course: Course | undefined;
  isLoading: boolean;
}

export default function CourseDescription({
  course,
  isLoading,
}: CourseDescriptionProps) {
  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="space-y-4">
          <div className="h-4 bg-[var(--color-background)] rounded w-3/4"></div>
          <div className="h-4 bg-[var(--color-background)] rounded w-full"></div>
          <div className="h-4 bg-[var(--color-background)] rounded w-5/6"></div>
        </div>
        <div className="space-y-4">
          <div className="h-4 bg-[var(--color-background)] rounded w-1/2"></div>
          <div className="h-4 bg-[var(--color-background)] rounded w-full"></div>
          <div className="h-4 bg-[var(--color-background)] rounded w-4/6"></div>
        </div>
      </div>
    );
  }

  const objectives = course?.details?.objectives?.split('\n').filter(Boolean) || [];
  const prerequisites = course?.details?.prerequisites?.split('\n').filter(Boolean) || [];
  const targetAudience = course?.details?.targetAudience?.split('\n').filter(Boolean) || [];

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-[var(--color-primary-dark)]">About This Course</h2>
        <p className="text-[var(--color-muted)] leading-relaxed">
          {course?.description}
        </p>
      </div>

      {objectives.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-[var(--color-primary-dark)]">What you'll learn</h3>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {objectives.map((objective, index) => (
              <li key={index} className="flex items-start space-x-2">
                <Check className="w-5 h-5 text-[var(--color-primary-light)] mt-0.5 flex-shrink-0" />
                <span className="text-[var(--color-muted)]">{objective}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {prerequisites.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-[var(--color-primary-dark)]">Prerequisites</h3>
          <ul className="space-y-2">
            {prerequisites.map((prerequisite, index) => (
              <li key={index} className="flex items-start space-x-2">
                <Check className="w-5 h-5 text-[var(--color-primary-light)] mt-0.5 flex-shrink-0" />
                <span className="text-[var(--color-muted)]">{prerequisite}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {targetAudience.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-[var(--color-primary-dark)]">Who this course is for</h3>
          <ul className="space-y-2">
            {targetAudience.map((audience, index) => (
              <li key={index} className="flex items-start space-x-2">
                <Check className="w-5 h-5 text-[var(--color-primary-light)] mt-0.5 flex-shrink-0" />
                <span className="text-[var(--color-muted)]">{audience}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {course?.details?.longDescription && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-[var(--color-primary-dark)]">Course Description</h3>
          <div className="prose max-w-none">
            <p className="text-[var(--color-muted)] leading-relaxed whitespace-pre-line">
              {course.details.longDescription}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
