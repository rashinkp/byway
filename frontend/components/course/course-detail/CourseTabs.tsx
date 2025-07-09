import { BookOpen, FileText, Star, User } from "lucide-react";
import { Course } from "@/types/course";

interface CourseTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isLoading: boolean;
  course?: Course;
  showReviews?: boolean;
  customTabs?: Array<{
    id: string;
    label: string;
    icon: React.ReactNode;
  }>;
}

export default function CourseTabs({
  activeTab,
  setActiveTab,
  isLoading,
  course,
  showReviews = true,
  customTabs = [],
}: CourseTabsProps) {
  const baseTabs = [
    {
      id: "description",
      label: "Description",
      icon: <FileText className="w-4 h-4" />,
    },
    {
      id: "instructor",
      label: "Instructor",
      icon: <User className="w-4 h-4" />,
    },
    {
      id: "syllabus",
      label: "Syllabus",
      icon: <BookOpen className="w-4 h-4" />,
    },
  ];

  const reviewTab = {
    id: "reviews",
    label: course?.reviewStats && course.reviewStats.totalReviews > 0 
      ? `Reviews (${course.reviewStats.totalReviews})` 
      : "Reviews",
    icon: <Star className="w-4 h-4" />,
  };

  // Combine base tabs with custom tabs and reviews if enabled
  let tabs = [...baseTabs, ...customTabs];
  if (showReviews) {
    tabs = [...tabs, reviewTab];
  }

  if (isLoading) {
    return (
      <div className="border-b border-[var(--color-primary-light)]/20">
        <div className="flex space-x-8 px-6 py-4">
          {tabs.map((_, i) => (
            <div
              key={i}
              className="h-8 bg-[var(--color-background)] rounded w-24 animate-pulse"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="border-b border-[var(--color-primary-light)]/20">
      <div className="flex space-x-8 px-6 py-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center space-x-2 py-2 px-1 border-b-2 transition-colors ${
              activeTab === tab.id
                ? "border-[var(--color-primary-light)] text-[var(--color-primary-light)]"
                : "border-transparent text-[var(--color-muted)] hover:text-[var(--color-primary-dark)] hover:border-[var(--color-primary-light)]/40"
            }`}
          >
            {tab.icon}
            <span className="font-medium">{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
