"use client";

import { Course } from "@/types/course";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export const ActionSection = ({
  course,
  isEditing,
  isUpdating,
  onPublish,
}: {
  course: Course;
  isEditing: boolean;
  isUpdating: boolean;
  onPublish: () => void;
}) => {
  return (
    <div className="flex justify-end gap-2 mt-6">
      <Button
        onClick={onPublish}
        disabled={isEditing || isUpdating}
        className={
          course.status === "PUBLISHED"
            ? "bg-amber-500 hover:bg-amber-600"
            : "bg-emerald-500 hover:bg-emerald-600"
        }
      >
        {isUpdating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
        {course.status === "PUBLISHED" ? "Unpublish" : "Publish"}
      </Button>
    </div>
  );
};
