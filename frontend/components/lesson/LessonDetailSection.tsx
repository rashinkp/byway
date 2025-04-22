// src/components/lesson/LessonDetailSection.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import {
  LessonFormModal,
  LessonFormData,
} from "@/components/lesson/LessonFormModal";
import { ILesson } from "@/types/lesson";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { toast } from "sonner";

interface LessonDetailSectionProps {
  lesson: ILesson;
  courseId: string;
  nextOrder: number;
  onUpdateLesson: (data: LessonFormData) => void;
  isLoading: boolean;
  error: Error | null;
  onRetry?: () => void; // Optional retry callback for error state
}

export function LessonDetailSection({
  lesson,
  courseId,
  nextOrder,
  onUpdateLesson,
  isLoading,
  error,
  onRetry,
}: LessonDetailSectionProps) {
  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEditLesson = async (data: LessonFormData) => {
    setIsSubmitting(true);
    try {
      await onUpdateLesson(data);
      setIsLessonModalOpen(false);
      toast.success("Lesson updated successfully");
    } catch (err) {
      toast.error("Failed to update lesson");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (error) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <div className="text-red-600">
          <p>Error loading lesson: {error.message}</p>
          {onRetry && (
            <Button
              onClick={onRetry}
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white"
            >
              Retry
            </Button>
          )}
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-center">
          <div className="h-8 w-1/2 bg-gray-200 rounded animate-pulse" />
          <div className="h-10 w-32 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="mt-4 space-y-2">
          <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-1/4 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-1/3 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">{lesson.title}</h1>
        <Button
          onClick={() => setIsLessonModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white"
          disabled={isLoading || isSubmitting}
        >
          <Edit className="mr-2 h-4 w-4" />
          Edit Lesson
        </Button>
      </div>
      <div className="mt-4 space-y-2">
        <p>
          <span className="font-semibold">Description:</span>{" "}
          {lesson.description || "N/A"}
        </p>
        <p>
          <span className="font-semibold">Order:</span> {lesson.order}
        </p>
        <p>
          <span className="font-semibold">Thumbnail:</span>{" "}
          {lesson.thumbnail ? (
            <a
              href={lesson.thumbnail}
              target="_blank"
              className="text-blue-600"
            >
              View Thumbnail
            </a>
          ) : (
            "N/A"
          )}
        </p>
        <p>
          <span className="font-semibold">Status:</span>{" "}
          <StatusBadge isActive={!lesson.deletedAt} />
        </p>
      </div>

      <LessonFormModal
        open={isLessonModalOpen}
        onOpenChange={setIsLessonModalOpen}
        onSubmit={handleEditLesson}
        initialData={{
          title: lesson.title,
          description: lesson.description || "",
          order: lesson.order,
          thumbnail: lesson.thumbnail || "",
        }}
        courseId={courseId}
        nextOrder={nextOrder}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
