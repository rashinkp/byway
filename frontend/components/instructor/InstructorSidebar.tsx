    "use client";
    import { IInstructorDetails } from "@/types/instructor";
    import { ReactNode } from "react";
    import InstructorSidebarSkeleton from "./InstructorSidebarSkeleton";

    interface InstructorSidebarProps {
      instructor: IInstructorDetails | undefined;
      isLoading: boolean;
      adminActions?: ReactNode;
      userRole?: "USER" | "ADMIN" | "INSTRUCTOR";
    }

    export default function InstructorSidebar({
      instructor,
      isLoading,
      adminActions,
      userRole = "USER",
    }: InstructorSidebarProps) {
      if (isLoading) {
        return <InstructorSidebarSkeleton />;
      }

      if (!instructor) {
        return null;
      }

      return (
        <div className="bg-white/80 dark:bg-[#232326] shadow-lg rounded-2xl p-6 sticky top-8">
          <div className="space-y-8">
            {/* Admin Actions */}
            {adminActions && (
              <div className="space-y-4">
                <h4 className="font-semibold text-[#facc15] uppercase tracking-wide text-xs">Admin Actions</h4>
                {adminActions}
              </div>
            )}

            {/* Instructor Stats - Only show for non-admin users */}
            {userRole !== "ADMIN" && (
              <>
                <div className="space-y-4">
                  <h4 className="font-semibold text-[#facc15] uppercase tracking-wide text-xs">Instructor Stats</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500 dark:text-gray-300">Total Courses</span>
                      <span className="text-base font-semibold text-[#facc15] dark:text-[#facc15]">
                        {instructor.totalCourses || 0}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500 dark:text-gray-300">Total Students</span>
                      <span className="text-base font-semibold text-black dark:text-white">
                        {instructor.totalStudents || 0}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500 dark:text-gray-300">Joined</span>
                      <span className="text-xs font-medium text-black dark:text-white">
                        {new Date(instructor.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-3 pt-4 border-t border-dashed border-[#facc15]/20">
                  <h4 className="font-semibold text-[#facc15] uppercase tracking-wide text-xs">Contact</h4>
                  <div className="space-y-2">
                    <div className="text-xs text-gray-500 dark:text-gray-300">
                      <span className="font-medium">Email:</span> {instructor.email}
                    </div>
                    {instructor.website && (
                      <div className="text-xs text-gray-500 dark:text-gray-300">
                        <span className="font-medium">Website:</span>{" "}
                        <a
                          href={instructor.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#facc15] hover:text-black dark:hover:text-white hover:underline transition-colors"
                        >
                          Visit Website
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      );
    } 