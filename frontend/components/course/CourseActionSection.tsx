import { Course } from "@/types/course";
import { Button } from "../ui/button";
import { Recycle } from "lucide-react";
import { AlertComponent } from "../ui/AlertComponent";
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

  interface Action {
    confirmationMessage: (item: Course) => string;
  }

  const actions: Action[] = [
    {
      confirmationMessage: (item) =>
        `Are you sure you want to ${!item.deletedAt ? "disable" : "enable"} "${item.title}"?`,
    },
  ];

  const handleOpenConfirm = () => {
    setConfirmOpen(true);
  };

  const handleConfirm = () => {
    onToggleDelete();
    setConfirmOpen(false);
  };

  return (
    <div className="flex justify-end gap-2 mt-6">
      <Button
        onClick={handleOpenConfirm} // Open the dialog instead of directly calling onToggleDelete
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

      <AlertComponent
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title={!course.deletedAt ? "Confirm Disable" : "Confirm Enable"}
        description={(item) =>
          `Are you sure you want to ${!item.deletedAt ? "disable" : "enable"} "${item.title}"?`
        }
        confirmText={!course.deletedAt ? "Disable" : "Enable"}
        cancelText="Cancel"
        onConfirm={handleConfirm}
        item={course} // Use the actual course instead of a hardcoded item
        actions={actions}
        actionIndex={0}
      />
    </div>
  );
};
