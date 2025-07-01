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
    <section className={cn("mb-12 px-2 sm:px-0", className)}>
      <div className="mb-16">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-[var(--color-primary-dark)]">
          Explore & Find the perfect course to boost <br /> your skills and career.
        </h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-10">
        {courses.map((course) => (
          <div key={course.id} className="flex justify-center">
            <CourseCard course={course} />
          </div>
        ))}
      </div>
      <div className="flex justify-start gap-3 mt-10">
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
