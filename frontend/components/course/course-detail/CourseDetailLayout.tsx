import React, { ReactNode } from "react";
import { Course } from "@/types/course";
import { User, PublicUser } from "@/types/user";
import { ILesson, PublicLesson } from "@/types/lesson";
import { useAuthStore } from "@/stores/auth.store";
import CourseInfo from "./CourseInfo";
import CourseTabs from "./CourseTabs";
import CourseDescription from "./CourseDescription";
import CourseInstructor from "./CourseInstructor";
import CourseSyllabus from "./CourseSyllabus";
import CourseSidebar from "./CourseSidebar";
import CourseReviews from "@/components/review/CourseReviews";

interface CourseDetailLayoutProps {
  course: Course | undefined;
  instructor: (User | PublicUser) | undefined;
  lessons: (ILesson | PublicLesson)[] | undefined;
  isLoading: {
    course: boolean;
    instructor: boolean;
    lessons: boolean;
    user: boolean;
  };
  error: any;
  sidebarProps: {
    isCartLoading?: boolean;
    handleAddToCart?: () => void;
    isEnrolled?: boolean;
    userLoading?: boolean;
    adminActions?: ReactNode;
    instructorActions?: ReactNode;
  };
  tabContent?: {
    [key: string]: ReactNode;
  };
  showReviews?: boolean;
  customTabs?: Array<{
    id: string;
    label: string;
    icon: React.ReactNode;
  }>;
}

export default function CourseDetailLayout({
  course,
  instructor,
  lessons,
  isLoading,
  error,
  sidebarProps,
  tabContent,
  showReviews = true,
  customTabs = [],
}: CourseDetailLayoutProps) {
  const [activeTab, setActiveTab] = React.useState("description");
  const { user } = useAuthStore();
  const userRole = user?.role || "USER";

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50/50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-8">
            <div className="text-red-600 mb-2">Course Error</div>
            <p className="text-gray-600">Error occurred while loading the course.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className={`space-y-6 ${userRole === "USER" ? "lg:w-3/4" : "w-full"}`}>
            <CourseInfo
              course={course}
              instructor={instructor as User}
              lessonsLength={lessons?.length}
              courseLoading={isLoading.course}
              instructorLoading={isLoading.instructor}
              isEnrolled={course?.isEnrolled || false}
              userRole={userRole}
            />
            
            <div className="bg-white/80 backdrop-blur-sm border border-gray-100 shadow-sm rounded-xl overflow-hidden">
              <CourseTabs
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                isLoading={isLoading.course}
                course={course}
                showReviews={showReviews}
                customTabs={customTabs}
              />
              
              <div className="p-6">
                {activeTab === "description" && (
                  tabContent?.description || (
                    <CourseDescription course={course} isLoading={isLoading.course} />
                  )
                )}
                {activeTab === "instructor" && (
                  tabContent?.instructor || (
                    <CourseInstructor
                      instructor={instructor as User}
                      isLoading={isLoading.instructor}
                      userRole={userRole}
                    />
                  )
                )}
                {activeTab === "syllabus" && (
                  tabContent?.syllabus || (
                    <CourseSyllabus
                      lessons={lessons}
                      isLoading={isLoading.lessons}
                    />
                  )
                )}
                {activeTab === "reviews" && showReviews && (
                  tabContent?.reviews || (
                    <CourseReviews
                      course={course}
                      isLoading={isLoading.course}
                      userRole={userRole}
                    />
                  )
                )}
                {/* Render custom tab content if provided */}
                {tabContent && Object.keys(tabContent).map((tabKey) => {
                  if (activeTab === tabKey && tabContent[tabKey]) {
                    return <div key={tabKey}>{tabContent[tabKey]}</div>;
                  }
                  return null;
                })}
              </div>
            </div>
          </div>
          
          {/* Only show sidebar for users */}
          {userRole === "USER" && (
            <div className="lg:w-1/4">
              <CourseSidebar
                course={course}
                isLoading={isLoading.course || isLoading.user}
                isCartLoading={sidebarProps.isCartLoading}
                handleAddToCart={sidebarProps.handleAddToCart}
                isEnrolled={sidebarProps.isEnrolled || false}
                adminActions={sidebarProps.adminActions}
                instructorActions={sidebarProps.instructorActions}
                userRole={userRole}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 