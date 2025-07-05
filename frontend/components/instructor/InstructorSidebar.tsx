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
    <div className="bg-[var(--color-surface)]/95 border border-[var(--color-primary-light)]/20 shadow-lg rounded-2xl p-6 sticky top-8">
      <div className="space-y-8">
        {/* Admin Actions */}
        {adminActions && (
          <div className="space-y-4">
            <h4 className="font-semibold text-[var(--color-primary-dark)] uppercase tracking-wide text-xs">Admin Actions</h4>
            {adminActions}
          </div>
        )}

        {/* Instructor Stats - Only show for non-admin users */}
        {userRole !== "ADMIN" && (
          <>
            <div className="space-y-4">
              <h4 className="font-semibold text-[var(--color-primary-dark)] uppercase tracking-wide text-xs">Instructor Stats</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[var(--color-muted)]">Total Courses</span>
                  <span className="text-base font-semibold text-[var(--color-primary-light)]">
                    {instructor.totalCourses || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[var(--color-muted)]">Total Students</span>
                  <span className="text-base font-semibold text-[var(--color-accent)]">
                    {instructor.totalStudents || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[var(--color-muted)]">Joined</span>
                  <span className="text-xs font-medium text-[var(--color-primary-dark)]">
                    {new Date(instructor.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-3 pt-4 border-t border-dashed border-[var(--color-primary-light)]/20">
              <h4 className="font-semibold text-[var(--color-primary-dark)] uppercase tracking-wide text-xs">Contact</h4>
              <div className="space-y-2">
                <div className="text-xs text-[var(--color-muted)]">
                  <span className="font-medium">Email:</span> {instructor.email}
                </div>
                {instructor.website && (
                  <div className="text-xs text-[var(--color-muted)]">
                    <span className="font-medium">Website:</span>{" "}
                    <a
                      href={instructor.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[var(--color-primary-light)] hover:text-[var(--color-primary-dark)] hover:underline transition-colors"
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