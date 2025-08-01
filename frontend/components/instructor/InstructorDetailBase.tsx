import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  BookOpen, 
  Users, 
  Globe, 
  GraduationCap, 
  Briefcase,
  Mail,
  FileText,
} from "lucide-react";
import { InstructorDetailBaseProps } from "@/types/instructor";
import { Course } from "@/types/course";
import { CourseCard } from "@/components/course/CourseCard";
import Link from "next/link";
import InstructorSidebar from "./InstructorSidebar";
import Image from 'next/image';



export const InstructorDetailBase: React.FC<InstructorDetailBaseProps> = ({
  instructor,
  courses,
  isCoursesLoading,
  renderStatusBadges,
  sidebarProps,
}) => {
  const [activeTab, setActiveTab] = useState("about");
  const userRole = sidebarProps?.userRole || "USER";

  const education = instructor.education
    ? instructor.education
        .split("\n")
        .map((edu) => edu.replace("- ", "").trim())
        .filter(Boolean)
    : [];

  const tabs = [
    {
      id: "about",
      label: "About",
      icon: <FileText className="w-4 h-4" />,
    },
    {
      id: "education",
      label: "Education",
      icon: <GraduationCap className="w-4 h-4" />,
    },
    {
      id: "experience",
      label: "Experience",
      icon: <Briefcase className="w-4 h-4" />,
    },
    {
      id: "courses",
      label: "Courses",
      icon: <BookOpen className="w-4 h-4" />,
    },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "about":
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">About</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {instructor.about || "No bio available"}
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2 text-yellow-500">
                  <Mail className="w-5 h-5 text-yellow-500" />
                  <span>{instructor.email}</span>
                </div>
                {instructor.website && (
                  <div className="flex items-center space-x-2 text-yellow-500">
                    <Globe className="w-5 h-5 text-yellow-500" />
                    <a href={instructor.website} target="_blank" rel="noopener noreferrer" className="text-yellow-500 hover:text-yellow-600 hover:underline">
                      {instructor.website}
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      case "education":
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Education</h3>
            {education.length > 0 ? (
              <div className="space-y-4">
                {education.map((edu, index) => (
                  <div key={index} className="bg-white dark:bg-[#232326] p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 dark:text-gray-100">{edu}</h4>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-300">No education information available</p>
            )}
          </div>
        );
      case "experience":
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Experience</h3>
            <div className="space-y-4">
              <div className="bg-white dark:bg-[#232326] p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Area of Expertise</h4>
                <p className="text-gray-700 dark:text-gray-300">{instructor.areaOfExpertise}</p>
              </div>
              <div className="bg-white dark:bg-[#232326] p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Professional Experience</h4>
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">{instructor.professionalExperience}</p>
              </div>
            </div>
          </div>
        );
      case "courses":
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Courses</h3>
            {isCoursesLoading ? (
              <div className={`grid gap-6 ${
                userRole === "ADMIN" 
                  ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-2" 
                  : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
              }`}>
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="p-4">
                    <div className="h-6 w-3/4 bg-yellow-200 dark:bg-yellow-900/40 rounded animate-pulse" />
                    <div className="h-4 w-full mt-2 bg-yellow-200 dark:bg-yellow-900/40 rounded animate-pulse" />
                    <div className="h-4 w-2/3 mt-2 bg-yellow-200 dark:bg-yellow-900/40 rounded animate-pulse" />
                  </div>
                ))}
              </div>
            ) : courses && courses.length > 0 ? (
              <div className={`grid gap-6 ${
                userRole === "ADMIN" 
                  ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-2" 
                  : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
              }`}>
                {courses.map((course: Course) => (
                  <Link key={course.id} href={`/courses/${course.id}`}>
                    <CourseCard course={course} />
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-300">No courses available</p>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#18181b] p-0 md:p-8 flex flex-col items-center">
      <div className="w-full mx-auto space-y-8">
        {/* Header Section */}
        <Card className="bg-white dark:bg-[#232326] shadow-xl border border-gray-200 dark:border-gray-700 rounded-2xl p-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            {/* Avatar/Initial */}
            <div className="flex-shrink-0 flex flex-col items-center gap-2">
              {instructor.avatar ? (
                <Image
                  src={instructor.avatar}
                  alt={instructor.name}
                  width={96}
                  height={96}
                 className="w-24 h-24 rounded-full object-cover border-4 border-yellow-500 shadow-md bg-white dark:bg-[#232326]"
                />
              ) : (
                <div className="w-24 h-24 rounded-full flex items-center justify-center text-4xl font-bold bg-yellow-500 text-white border-4 border-yellow-500 shadow-md">
                  {instructor?.name?.charAt(0) || "I"}
                </div>
              )}
              <span className="text-xs text-gray-500 dark:text-gray-300 mt-1">Instructor</span>
            </div>
            {/* Main Info */}
            <div className="flex-1 flex flex-col items-center md:items-start gap-2">
              <h1 className="text-3xl font-bold text-yellow-500 mb-1 text-center md:text-left">{instructor.name}</h1>
              <p className="text-lg text-gray-500 dark:text-gray-300 mb-2 text-center md:text-left">{instructor.areaOfExpertise}</p>
              <div className="flex flex-wrap items-center gap-3 justify-center md:justify-start">
                <Badge variant="outline" className="bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 border-yellow-400/40">
                  <Calendar className="w-3 h-3 mr-1" />
                  Joined {new Date(instructor.createdAt).toLocaleDateString()}
                </Badge>
                <Badge variant="outline" className="bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 border-yellow-400/40">
                  <BookOpen className="w-3 h-3 mr-1" />
                  {courses?.length || 0} Courses
                </Badge>
                <Badge variant="outline" className="bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 border-yellow-400/40">
                  <Users className="w-3 h-3 mr-1" />
                  {instructor.totalStudents || 0} Students
                </Badge>
                {renderStatusBadges?.()}
              </div>
              {instructor.website && (
                <a
                  href={instructor.website}
                  target="_blank"
                  rel="noopener noreferrer"
                 className="inline-flex items-center gap-1 mt-2 text-sm text-yellow-500 hover:text-yellow-600 hover:underline transition-colors"
                >
                  <Globe className="w-4 h-4" /> Visit Website
                </a>
              )}
            </div>
          </div>
        </Card>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content Section */}
          <div className={`space-y-8 ${userRole === "ADMIN" ? "lg:w-3/4" : "w-full"}`}>
            <Card className="bg-white dark:bg-[#232326] border border-gray-200 dark:border-gray-700 shadow-lg rounded-2xl overflow-hidden">
              {/* Tabs Section */}
              <div className="border-b border-gray-200 dark:border-gray-700">
                <div className="flex space-x-8 px-6 py-4 overflow-x-auto whitespace-nowrap scrollbar-thin tab-scrollbar md:overflow-visible md:whitespace-normal relative">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                     className={`flex items-center space-x-2 py-2 px-1 border-b-2 transition-colors font-medium text-base ${
                       activeTab === tab.id
                         ? "border-yellow-400 text-yellow-500 bg-white dark:bg-[#232326] rounded-t"
                         : "border-transparent text-gray-500 dark:text-gray-300 hover:text-yellow-400 hover:border-yellow-400/40"
                     }`}
                    >
                      {tab.icon}
                      <span>{tab.label}</span>
                    </button>
                  ))}
                  {/* Right fade for scroll cue */}
                 <div className="pointer-events-none absolute right-0 top-0 h-full w-8 bg-gradient-to-l from-white dark:from-[#232326]/90 to-transparent hidden sm:block" />
                </div>
               </div>

              {/* Content Section */}
              <div className="p-8 bg-white dark:bg-[#232326]">
                {renderTabContent()}
              </div>
            </Card>
          </div>

          {/* Sidebar - Only show for admin users */}
          {userRole === "ADMIN" && (
            <div className="lg:w-1/4">
              <InstructorSidebar
                instructor={instructor}
                isLoading={false}
                adminActions={sidebarProps?.adminActions}
                userRole={userRole}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 