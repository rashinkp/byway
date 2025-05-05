"use client";

import { Course } from "@/types/course";
import { formatDate } from "@/utils/formatDate";
import { Badge } from "../ui/badge";




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
        <div>
          <h3 className="text-sm font-medium text-gray-600">Offer Price</h3>
          <p className="mt-1 text-gray-900">
            ${course?.offer?.toFixed(2) || "0.00"}
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
          <h3 className="text-sm font-medium text-gray-600">Stage</h3>
          <Badge
            className={
              course?.status === "PUBLISHED"
                ? "bg-green-100 text-green-800"
                : course?.status === "DRAFT"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-red-100 text-red-800"
            }
          >
            {course?.status}
          </Badge>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-600">Status</h3>
          <Badge
            className={
              !course?.deletedAt
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }
          >
            {!course?.deletedAt ? "Active" : "Inactive"}
          </Badge>
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
