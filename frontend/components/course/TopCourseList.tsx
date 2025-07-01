import { cn } from "@/utils/cn";
import { Course } from "@/types/course";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import React from "react";
import { CourseCard } from "@/components/course/CourseCard";

interface TopCoursesProps {
  courses: Course[];
  className?: string;
  variant?: 'default' | 'compact' | 'sidebar';
  router: any;
}

export function TopCourses({ courses, className, variant = 'compact', router }: TopCoursesProps) {
  return (
    <section className={cn("mb-8 sm:mb-12", className)}>
      <div className="mb-8">
        <h2 className="text-3xl sm:text-4xl font-bold mb-2 text-[var(--color-primary-dark)]">
          Explore & Find the perfect course to boost <br /> your skills and career.
        </h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
      <div className="flex justify-start gap-2 mt-6">
        <Button variant="outline">
          <ChevronLeft className="w-6 h-6" />
        </Button>
        <Button variant="outline">
          <ChevronRight className="w-6 h-6" />
        </Button>
      </div>
    </section>
  );
}
