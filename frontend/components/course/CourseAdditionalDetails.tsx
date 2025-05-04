"use client";

import { Course } from "@/types/course";
import { Badge } from "@/components/ui/badge";
import { TabsContent } from "@/components/ui/tabs";

interface AdditionalDetailsSectionProps {
  course?: Course;
}

export function AdditionalDetailsSection({ course }: AdditionalDetailsSectionProps) {
  const status = course?.deletedAt ? "Inactive" : "Active";

  return (
    <TabsContent value="details" className="mt-0">
      <div className="space-y-6">
        {/* Status Indicator */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Status</h3>
          <Badge
            variant={status === "Active" ? "default" : "destructive"}
            className={
              status === "Active"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }
          >
            {status}
          </Badge>
        </div>

        {/* Prerequisites */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Prerequisites</h3>
          <p className="text-gray-600">
            {course?.details?.prerequisites || "No prerequisites specified."}
          </p>
        </div>

        {/* Long Description */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Detailed Description
          </h3>
          <p className="text-gray-600">
            {course?.details?.longDescription ||
              "No detailed description available."}
          </p>
        </div>

        {/* Learning Objectives */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Learning Objectives
          </h3>
          <p className="text-gray-600">
            {course?.details?.objectives || "No learning objectives specified."}
          </p>
        </div>

        {/* Target Audience */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Target Audience
          </h3>
          <p className="text-gray-600">
            {course?.details?.targetAudience ||
              "No target audience specified."}
          </p>
        </div>
      </div>
    </TabsContent>
  );
}