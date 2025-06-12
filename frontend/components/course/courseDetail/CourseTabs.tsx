import { BookOpen, FileText, Star, User } from "lucide-react";

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
  const tabs = [
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
    {
      id: "reviews",
      label: "Reviews",
      icon: <Star className="w-4 h-4" />,
    },
  ];

  if (isLoading) {
    return (
      <div className="border-b border-gray-100">
        <div className="flex space-x-8 px-6 py-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-8 bg-gray-200 rounded w-24 animate-pulse"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="border-b border-gray-100">
      <div className="flex space-x-8 px-6 py-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center space-x-2 py-2 px-1 border-b-2 transition-colors ${
              activeTab === tab.id
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
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
