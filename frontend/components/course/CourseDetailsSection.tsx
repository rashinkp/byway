"use client";

import { Course } from "@/types/course";
import { formatDate } from "@/utils/formatDate";
import { Badge } from "../ui/badge";
import { BookOpen, Clock, Award, DollarSign, Calendar, User } from "lucide-react";

export const DetailsSection = ({ course }: { course?: Course }) => {
  return (
    <div className="space-y-6">
      {/* Course Title and Description */}
      <div className="space-y-3">
        <h1 className="text-2xl font-bold text-gray-900">
          {course?.title || "Course Title"}
        </h1>
        <p className="text-gray-600 leading-relaxed">
          {course?.description || "No description available"}
        </p>
      </div>

      {/* Course Stats */}
      <div className="flex flex-wrap items-center gap-3">
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
          <BookOpen className="w-3 h-3 mr-1" />
          {course?.level || "All Levels"}
        </Badge>
        
        {course?.duration && (
          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
            <Clock className="w-3 h-3 mr-1" />
            {course.duration} min
          </Badge>
        )}
        
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          <Award className="w-3 h-3 mr-1" />
          {course?.status || "DRAFT"}
        </Badge>
        
        {course?.price && (
          <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
            <DollarSign className="w-3 h-3 mr-1" />
            ${Number(course.price).toFixed(2)}
            {course.offer && course.offer !== course.price && (
              <span className="ml-1 line-through text-gray-500">
                ${Number(course.offer).toFixed(2)}
              </span>
            )}
          </Badge>
        )}
      </div>

      {/* Course Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
        <div className="space-y-3">
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
              Created At
            </p>
            <p className="text-sm text-gray-900">
              {formatDate(course?.createdAt || null) || "Not available"}
            </p>
          </div>
          
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
              Approval Status
            </p>
            <Badge
              className={
                course?.approvalStatus === "APPROVED"
                  ? "bg-green-100 text-green-800"
                  : course?.approvalStatus === "PENDING"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-red-100 text-red-800"
              }
            >
              {course?.approvalStatus || "PENDING"}
            </Badge>
          </div>
        </div>
        
        <div className="space-y-3">
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
              Course Status
            </p>
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
          
        </div>
      </div>
    </div>
  );
};
