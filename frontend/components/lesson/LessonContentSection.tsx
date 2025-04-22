// src/components/lesson/ContentSection.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ContentInputForm } from "@/components/lesson/LessonContentInputForm";
import { ContentList } from "@/components/lesson/LessonContentList";
import { LessonContent, LessonContentFormData } from "@/types/lesson";
import { toast } from "sonner";

interface ContentSectionProps {
  contents: LessonContent[];
  lessonId: string;
  onAddContent: (data: LessonContentFormData) => void;
  onEditContent: (data: LessonContentFormData, contentId: string) => void;
  onDeleteContent: (content: LessonContent) => void;
}

export function ContentSection({
  contents,
  lessonId,
  onAddContent,
  onEditContent,
  onDeleteContent,
}: ContentSectionProps) {
  const [showContentForm, setShowContentForm] = useState(false);
  const [editingContent, setEditingContent] = useState<LessonContent | null>(
    null
  );

  const handleAddContent = (data: LessonContentFormData) => {
    onAddContent(data);
    setShowContentForm(false);
    toast.success("Content created successfully");
  };

  const handleEditContent = (data: LessonContentFormData) => {
    if (!editingContent) return;
    onEditContent(data, editingContent.id);
    setShowContentForm(false);
    setEditingContent(null);
    toast.success("Content updated successfully");
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800">Lesson Content</h2>
        <Button
          onClick={() => {
            setEditingContent(null);
            setShowContentForm(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          Add Content
        </Button>
      </div>

      {showContentForm && (
        <ContentInputForm
          onSubmit={editingContent ? handleEditContent : handleAddContent}
          initialData={
            editingContent
              ? {
                  type: editingContent.type,
                  status: editingContent.status,
                  data: editingContent.data,
                }
              : undefined
          }
          onCancel={() => {
            setShowContentForm(false);
            setEditingContent(null);
          }}
        />
      )}

      <ContentList
        contents={contents}
        onEdit={(content) => {
          setEditingContent(content);
          setShowContentForm(true);
        }}
        onDelete={onDeleteContent}
      />
    </div>
  );
}
