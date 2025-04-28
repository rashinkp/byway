"use client";

import { useState } from "react";
import { ContentType, LessonContent } from "@/types/content";
import { ContentInputForm } from "./ContentInputForm";
import { toast } from "sonner";
import { useGetContentByLessonId } from "@/hooks/content/useGetContentByLessonId";
import { useDeleteContent } from "@/hooks/content/useDeleteContent";

interface ContentSectionProps {
  lessonId: string;
}

export const ContentSection = ({ lessonId }: ContentSectionProps) => {
  const { data: content, isLoading } = useGetContentByLessonId(lessonId);
  const { mutate: deleteContent, isPending: isDeleting } =
    useDeleteContent(lessonId);
  const [isEditing, setIsEditing] = useState(false);

  const handleDelete = (contentId: string) => {
    deleteContent(contentId, {
      onSuccess: () => {
        toast.success("Content deleted successfully");
        setIsEditing(true);
      },
      onError: (error: Error) => toast.error(error.message),
    });
  };

  const handleFormSuccess = () => {
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <p className="text-gray-500">Loading content...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Lesson Content</h2>
      {isEditing ? (
        <ContentInputForm
          lessonId={lessonId}
          initialData={content}
          onSuccess={handleFormSuccess}
        />
      ) : content ? (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">{content.data.title}</h3>
          {content.data.description && (
            <p className="text-gray-700">{content.data.description}</p>
          )}
          {content.type === ContentType.VIDEO && content.data.fileUrl && (
            <video
              src={content.data.fileUrl}
              controls
              className="w-full rounded-lg"
            />
          )}
          {content.type === ContentType.DOCUMENT && content.data.fileUrl && (
            <a
              href={content.data.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              View Document
            </a>
          )}
          {content.type === ContentType.QUIZ && content.data.questions && (
            <div className="space-y-4">
              {content.data.questions.map((q, index) => (
                <div key={index} className="mb-4">
                  <p className="font-medium">{q.question}</p>
                  <ul className="list-disc pl-5 text-gray-700">
                    {q.options.map((opt, i) => (
                      <li key={i}>{opt}</li>
                    ))}
                  </ul>
                  <p className="text-green-600 font-semibold">
                    Answer: {q.answer}
                  </p>
                </div>
              ))}
            </div>
          )}
          <div className="flex space-x-4 mt-4">
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              disabled={isDeleting}
            >
              {isDeleting ? "Please wait..." : "Edit Content"}
            </button>
            <button
              onClick={() => handleDelete(content.id)}
              disabled={isDeleting}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
            >
              {isDeleting ? "Deleting..." : "Delete Content"}
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsEditing(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Add Content
        </button>
      )}
    </div>
  );
};
