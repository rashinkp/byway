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
    <div className="bg-white/80 backdrop-blur-sm border border-gray-100 shadow-sm rounded-xl p-6 sticky top-6">
      <div className="space-y-6">
        {/* Admin Actions */}
        {adminActions && (
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">Admin Actions</h4>
            {adminActions}
          </div>
        )}

        {/* Instructor Stats - Only show for non-admin users */}
        {userRole !== "ADMIN" && (
          <>
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Instructor Stats</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total Courses</span>
                  <span className="text-sm font-medium text-gray-900">
                    {instructor.totalCourses || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total Students</span>
                  <span className="text-sm font-medium text-gray-900">
                    {instructor.totalStudents || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Joined</span>
                  <span className="text-sm font-medium text-gray-900">
                    {new Date(instructor.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Contact</h4>
              <div className="space-y-2">
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Email:</span> {instructor.email}
                </div>
                {instructor.website && (
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Website:</span>{" "}
                    <a
                      href={instructor.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
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