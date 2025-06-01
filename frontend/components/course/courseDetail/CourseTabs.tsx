import { Skeleton } from "@/components/ui/skeleton";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

interface CourseTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isLoading: boolean;
}

export default function CourseTabs({
  activeTab,
  setActiveTab,
  isLoading,
}: CourseTabsProps) {
  if (isLoading) {
    return (
      <div className="py-4">
        <LoadingSpinner size="sm" text="Loading course content..." />
      </div>
    );
  }

  return (
    <div className="border-b mb-6">
      <div className="flex gap-6">
        {["Description", "Instructor", "Syllabus", "Reviews"].map((tab) => (
          <button
            key={tab}
            className={`py-3 px-1 ${
              activeTab === tab.toLowerCase()
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-600"
            }`}
            onClick={() => setActiveTab(tab.toLowerCase())}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  );
}
