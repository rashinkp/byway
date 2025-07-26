"use client";

import { Course } from "@/types/course";
import { formatDate } from "@/utils/formatDate";
import { Badge } from "../ui/badge";
import { BookOpen, Clock, Award, DollarSign } from "lucide-react";

export const DetailsSection = ({ course }: { course?: Course }) => {
  return (
    <div className="space-y-6">
      {/* Course Title and Description */}
      <div className="space-y-3">
        <h1 className="text-2xl font-bold text-[var(--color-primary-dark)]">
          {course?.title || "Course Title"}
        </h1>
        <p className="text-[var(--color-muted)] leading-relaxed">
          {course?.description || "No description available"}
        </p>
      </div>

      {/* Course Stats */}
      <div className="flex flex-wrap items-center gap-3">
        <Badge variant="outline" className="bg-[var(--color-primary-light)]/10 text-[var(--color-primary-light)] border-[var(--color-primary-light)]/40">
          <BookOpen className="w-3 h-3 mr-1" />
          {course?.level || "All Levels"}
        </Badge>
        
        {course?.duration && (
          <Badge variant="outline" className="bg-[var(--color-accent)]/10 text-[var(--color-accent)] border-[var(--color-accent)]/40">
            <Clock className="w-3 h-3 mr-1" />
            {course.duration} min
          </Badge>
        )}
        
        <Badge variant="outline" className="bg-[var(--color-primary-light)]/10 text-[var(--color-primary-light)] border-[var(--color-primary-light)]/40">
          <Award className="w-3 h-3 mr-1" />
          {course?.status || "DRAFT"}
        </Badge>
        
        {course?.price && (
          <Badge variant="outline" className="bg-[var(--color-warning)]/10 text-[var(--color-warning)] border-[var(--color-warning)]/40">
            <DollarSign className="w-3 h-3 mr-1" />
            ${Number(course.offer || course.price).toFixed(2)}
            {course.offer && course.offer !== course.price && (
              <span className="ml-1 line-through text-[var(--color-muted)]">
                ${Number(course.price).toFixed(2)}
              </span>
            )}
          </Badge>
        )}
      </div>

      {/* Course Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-[var(--color-primary-light)]/20">
        <div className="space-y-3">
          <div>
            <p className="text-xs font-medium text-[var(--color-muted)] uppercase tracking-wide mb-1">
              Created At
            </p>
            <p className="text-sm text-[var(--color-primary-dark)]">
              {formatDate(course?.createdAt || null) || "Not available"}
            </p>
          </div>
          
          <div>
            <p className="text-xs font-medium text-[var(--color-muted)] uppercase tracking-wide mb-1">
              Approval Status
            </p>
            <Badge
              className={
                course?.approvalStatus === "APPROVED"
                  ? "bg-[var(--color-primary-light)]/10 text-[var(--color-primary-light)] border-[var(--color-primary-light)]/40"
                  : course?.approvalStatus === "PENDING"
                  ? "bg-[var(--color-warning)]/10 text-[var(--color-warning)] border-[var(--color-warning)]/40"
                  : "bg-[var(--color-danger)]/10 text-[var(--color-danger)] border-[var(--color-danger)]/40"
              }
            >
              {course?.approvalStatus || "PENDING"}
            </Badge>
          </div>
        </div>
        
        <div className="space-y-3">
          <div>
            <p className="text-xs font-medium text-[var(--color-muted)] uppercase tracking-wide mb-1">
              Course Status
            </p>
            <Badge
              className={
                !course?.deletedAt
                  ? "bg-[var(--color-primary-light)]/10 text-[var(--color-primary-light)] border-[var(--color-primary-light)]/40"
                  : "bg-[var(--color-danger)]/10 text-[var(--color-danger)] border-[var(--color-danger)]/40"
              }
            >
              {!course?.deletedAt ? "Active" : "Inactive"}
            </Badge>
          </div>
          
        </div>
      </div>
    </div>
  );
};
