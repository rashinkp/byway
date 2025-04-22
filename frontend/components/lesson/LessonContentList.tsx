// src/components/lesson/ContentList.tsx
"use client";

import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { LessonContent } from "@/types/lesson";

interface ContentListProps {
  contents: LessonContent[];
  onEdit: (content: LessonContent) => void;
  onDelete: (content: LessonContent) => void;
}

export function ContentList({ contents, onEdit, onDelete }: ContentListProps) {
  return (
    <div className="mt-4">
      <h3 className="text-lg font-semibold mb-2">Content</h3>
      {contents.length === 0 ? (
        <p className="text-gray-500">No content available.</p>
      ) : (
        <ul className="space-y-2">
          {contents.map((content) => (
            <li
              key={content.id}
              className="flex justify-between items-center border p-4 rounded-lg"
            >
              <div>
                <p>
                  <span className="font-semibold">Type:</span> {content.type}
                </p>
                <p>
                  <span className="font-semibold">Data:</span>{" "}
                  {content.type === "VIDEO" || content.type === "DOC"
                    ? content.data.fileUrl || "N/A"
                    : `${content.data.questions?.length || 0} questions`}
                </p>
                <p>
                  <span className="font-semibold">Status:</span>{" "}
                  <StatusBadge isActive={content.status === "PUBLISHED"} />
                </p>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(content)}
                >
                  Edit
                </Button>
                <Button
                  variant={content.deletedAt ? "default" : "destructive"}
                  size="sm"
                  onClick={() => onDelete(content)}
                  disabled={!!content.deletedAt}
                >
                  {content.deletedAt ? "Restore" : "Delete"}
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
