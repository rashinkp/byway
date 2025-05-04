"use client";

import { Course } from "@/types/course";
import { formatDate } from "@/utils/formatDate";
import { StatusBadge } from "@/components/ui/StatusBadge";

export const DetailsSection = ({ course }: { course?: Course }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-medium text-gray-600">Title</h3>
          <p className="mt-1 text-gray-900">
            {course?.title || "Not available"}
          </p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-600">Level</h3>
          <p className="mt-1 text-gray-900">
            {course?.level
              ? course.level.charAt(0) + course.level.slice(1).toLowerCase()
              : "Not available"}
          </p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-600">Price</h3>
          <p className="mt-1 text-gray-900">
            ${course?.price?.toFixed(2) || "0.00"}
          </p>
        </div>
      </div>
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-medium text-gray-600">Duration</h3>
          <p className="mt-1 text-gray-900">
            {course?.duration ? `${course.duration} hours` : "Not available"}
          </p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-600">Status</h3>
          <span>{course?.status}</span>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-600">Created At</h3>
          <p className="mt-1 text-gray-900">
            {formatDate(course?.createdAt || null) || "Not available"}
          </p>
        </div>
      </div>
    </div>
  );
};
