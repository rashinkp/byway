"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { LessonContent, LessonContentFormData } from "@/types/lesson";
import { toast } from "sonner";
import { ContentInputForm } from "./LessonContentInputForm";

interface ContentSectionProps {
  content?: LessonContent;
  lessonId: string;
  onAddContent: (data: LessonContentFormData) => void;
  onEditContent: (data: LessonContentFormData, contentId: string) => void;
}

export function ContentSection({
  content,
  lessonId,
  onAddContent,
  onEditContent,
}: ContentSectionProps) {
  const [showTypeSelection, setShowTypeSelection] = useState(!content);
  const [selectedType, setSelectedType] = useState<
    "VIDEO" | "DOC" | "QUIZ" | null
  >(null);
  const [editing, setEditing] = useState(false);

  const handleTypeSelection = (type: "VIDEO" | "DOC" | "QUIZ") => {
    setSelectedType(type);
    setShowTypeSelection(false);
  };

  const handleAddContent = (data: LessonContentFormData) => {
    onAddContent(data);
    setSelectedType(null);
    toast.success("Content created successfully");
  };

  const handleEditContent = (data: LessonContentFormData) => {
    if (!content) return;
    onEditContent(data, content.id);
    setEditing(false);
    setSelectedType(null);
    toast.success("Content updated successfully");
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Lesson Content</h2>
      
      </div>

      {showTypeSelection && !content && (
        <div className="mb-8">
          <h3 className="font-semibold text-gray-800 mb-4">
            Select Content Type
          </h3>
          <div className="flex gap-4">
            <Button
              onClick={() => handleTypeSelection("VIDEO")}
              className="bg-black hover:bg-black text-white  px-6 py-3 rounded-lg transition-colors"
            >
              Video
            </Button>
            <Button
              onClick={() => handleTypeSelection("DOC")}
              className="bg-black hover:bg-black text-white  px-6 py-3 rounded-lg transition-colors"
            >
              Document
            </Button>
            <Button
              onClick={() => handleTypeSelection("QUIZ")}
              className="bg-black hover:bg-black text-white  px-6 py-3 rounded-lg transition-colors"
            >
              Quiz
            </Button>
          </div>
        </div>
      )}

      {(selectedType || editing) && (
        <ContentInputForm
          contentType={
            editing
              ? (content?.type as "VIDEO" | "DOC" | "QUIZ")
              : selectedType!
          }
          onSubmit={editing ? handleEditContent : handleAddContent}
          initialData={
            editing && content
              ? {
                  type: content.type,
                  status: content.status,
                  data: content.data,
                }
              : undefined
          }
          onCancel={() => {
            setSelectedType(null);
            setEditing(false);
            if (!content) setShowTypeSelection(true);
          }}
        />
      )}

      {content && !editing && !selectedType && (
        <div>
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-2xl font-semibold text-gray-900">
                {content.data.title || `${content.type} Content`}
              </h3>
              <p className="text-gray-700 text-lg mt-2">
                {content.data.description || "No description"}
              </p>
              <p className="text-sm text-gray-500 mt-2">Type: {content.type}</p>
              <p className="text-sm text-gray-500">Status: {content.status}</p>
              {content.type === "VIDEO" || content.type === "DOC" ? (
                <p className="text-sm text-blue-600 mt-2">
                  <a
                    href={content.data.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {content.data.fileUrl}
                  </a>
                </p>
              ) : (
                <p className="text-sm text-gray-500 mt-2">
                  Questions: {content.data.questions?.length || 0}
                </p>
              )}
              <p className="text-sm text-gray-500 mt-2">
                Upload Status: Pending (TBD)
              </p>
            </div>
            <Button
              onClick={() => setEditing(true)}
              className="bg-yellow-500 hover:bg-yellow-600 text-white text-lg px-6 py-3 rounded-lg transition-colors"
            >
              Edit
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
