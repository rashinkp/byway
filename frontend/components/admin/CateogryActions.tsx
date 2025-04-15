"use client";

import { Button } from "@/components/ui/button";
import { Edit, Trash, Undo } from "lucide-react";
import { Category } from "@/types/category";

interface CategoryActionsProps {
  category: Category;
  onEdit: (category: Category) => void;
  onToggleDelete: (category: Category) => void;
}

export default function CategoryActions({
  category,
  onEdit,
  onToggleDelete,
}: CategoryActionsProps) {
  return (
    <div className="flex space-x-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onEdit(category)}
        title="Edit"
      >
        <Edit className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onToggleDelete(category)}
        title={!category.deletedAt ? "Delete" : "Restore"}
      >
        {!category.deletedAt ? (
          <Trash className="h-4 w-4 text-red-600" />
        ) : (
          <Undo className="h-4 w-4 text-green-600" />
        )}
      </Button>
    </div>
  );
}
