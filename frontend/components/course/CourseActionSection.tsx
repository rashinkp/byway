import { Course } from "@/types/course";
import { Button } from "../ui/button";
import { AlertComponent } from "../ui/AlertComponent";
import { Loader2 } from "lucide-react";
import { useState } from "react";

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
}) => {
  const [confirmOpen, setConfirmOpen] = useState(false);

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
      <AlertComponent
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title={course.deletedAt ? "Confirm Enable" : "Confirm Disable"}
        description={() =>
          `Are you sure you want to ${
            course.deletedAt ? "enable" : "disable"
          } "${course.title}"?`
        }
        confirmText={course.deletedAt ? "Enable" : "Disable"}
        cancelText="Cancel"
        onConfirm={onToggleDelete}
        item={course}
      />
    </div>
  );
};
