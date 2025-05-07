import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

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
      <div>
        <h2 className="text-xl font-bold mb-4">Syllabus</h2>
        <div className="space-y-4">
          {[1, 2, 3].map((_, index) => (
            <div key={index} className="border rounded-lg p-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-5 w-5" />
                  <Skeleton className="h-4 w-40" />
                </div>
                <Skeleton className="h-4 w-12" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Syllabus</h2>
      <div className="space-y-4">
        {lessons?.map((lesson, index) => (
          <div key={index} className="border rounded-lg overflow-hidden">
            <button
              className="w-full flex justify-between items-center p-4 bg-gray-50"
              onClick={() => toggleModule(lesson.title)}
            >
              <div className="flex items-center gap-2">
                <ChevronDown
                  size={20}
                  className={`transform transition-transform ${
                    expandedModules.includes(lesson.title) ? "rotate-180" : ""
                  }`}
                />
                <span className="font-medium">{lesson.title}</span>
              </div>
              <div className="text-gray-500 text-sm">{lesson.order}</div>
            </button>
            {expandedModules.includes(lesson.title) && (
              <div className="p-4 bg-white">
                <p className="text-gray-600">{lesson.description}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
