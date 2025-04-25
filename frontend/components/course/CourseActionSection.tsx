import { Course } from "@/types/course";
import { Button } from "../ui/button";
import { Recycle } from "lucide-react";

export const ActionSection = ({
  course,
  isEditing,
  isUpdating,
  onPublish,
  onToggleDelete,
}: {
  course: Course;
  isEditing: boolean;
  isUpdating: boolean;
  onPublish: () => void;
  onToggleDelete: () => void;
}) => (
  <div className="flex justify-end gap-2 mt-6">
    <Button
      onClick={onToggleDelete}
      disabled={isEditing || isUpdating}
      className={
        !course.deletedAt
          ? "bg-red-600 hover:bg-red-700"
          : "bg-emerald-600 hover:bg-emerald-700"
      }
    >
      <Recycle className="mr-2 h-4 w-4" />
      {!course.deletedAt ? "Disable" : "Enable"}
    </Button>
    <Button
      onClick={onPublish}
      disabled={isEditing || isUpdating}
      className={
        course.status === "PUBLISHED"
          ? "bg-amber-600 hover:bg-amber-700"
          : "bg-emerald-600 hover:bg-emerald-700"
      }
    >
      {course.status === "PUBLISHED" ? "Unpublish" : "Publish"}
    </Button>
  </div>
);
