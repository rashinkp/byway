import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

interface CourseSyllabusProps {
  lessons: any[] | undefined;
  isLoading: boolean;
}

export default function CourseSyllabus({
  lessons,
  isLoading,
}: CourseSyllabusProps) {
  const [expandedModules, setExpandedModules] = useState<string[]>([]);

  const toggleModule = (moduleTitle: string) => {
    if (expandedModules.includes(moduleTitle)) {
      setExpandedModules(
        expandedModules.filter((title) => title !== moduleTitle)
      );
    } else {
      setExpandedModules([...expandedModules, moduleTitle]);
    }
  };

  if (isLoading) {
    return (
      <div className="py-4">
        <LoadingSpinner size="sm" text="Loading syllabus..." />
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4 text-[var(--color-primary-dark)]">Syllabus</h2>
      {(!lessons || lessons.length === 0) ? (
        <div className="bg-[var(--color-background)] border border-[var(--color-primary-light)]/20 rounded-lg p-6 text-center">
          <p className="text-[var(--color-muted)] text-base font-medium">Syllabus is not available. Please contact the team.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {lessons.map((lesson, index) => (
            <div key={index} className="border rounded-lg overflow-hidden border-[var(--color-primary-light)]/20">
              <button
                className="w-full flex justify-between items-center p-4 bg-[var(--color-background)]"
                onClick={() => toggleModule(lesson.title)}
              >
                <div className="flex items-center gap-2">
                  <ChevronDown
                    size={20}
                    className={`transform transition-transform ${
                      expandedModules.includes(lesson.title) ? "rotate-180" : ""
                    }`}
                  />
                  <span className="font-medium text-[var(--color-primary-dark)]">{lesson.title}</span>
                </div>
                <div className="text-[var(--color-muted)] text-sm">{lesson.order}</div>
              </button>
              {expandedModules.includes(lesson.title) && (
                <div className="p-4 bg-[var(--color-surface)]">
                  <p className="text-[var(--color-muted)]">{lesson.description}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
