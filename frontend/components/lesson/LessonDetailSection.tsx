"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import {
  LessonFormModal,
} from "@/components/lesson/LessonFormModal";
import { ILesson } from "@/types/lesson";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { toast } from "sonner";
import { formatDate } from "@/utils/formatDate";
import { AlertComponent } from "../ui/AlertComponent";
import { DetailsSectionSkeleton } from "../skeleton/CourseDetailSectionSkeleton";
import { deleteLesson } from "@/api/lesson";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { LessonFormData, lessonSchema } from "@/lib/validations/lesson";

interface LessonDetailSectionProps {
  lesson: ILesson;
  courseId: string;
  onUpdateLesson: (data: LessonFormData) => void;
  isLoading: boolean;
  error: Error | null;
  onRetry?: () => void;
}

export function LessonDetailSection({
  lesson,
  courseId,
  onUpdateLesson,
  isLoading,
  error,
  onRetry,
}: LessonDetailSectionProps) {
  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const router = useRouter();

  const handleEditLesson = async (data: LessonFormData) => {
    setIsSubmitting(true);
    try {
      lessonSchema.parse(data);
       onUpdateLesson(data);
      setIsLessonModalOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTogglePublish = async () => {
    setIsSubmitting(true);
    try {
      const updatedStatus =
        lesson.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
      const data: LessonFormData = {
        title: lesson.title,
        order: lesson.order,
        status: updatedStatus,
        description: lesson.description || "",
      };
      // Validate data
      lessonSchema.parse(data);
      onUpdateLesson(data);
    } catch (err) {
      console.error("Error updating lesson status:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenConfirm = () => {
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!lesson.id) {
      toast.error("Lesson ID is missing");
      return;
    }
    setIsSubmitting(true);
    try {
      await deleteLesson(lesson.id);
      toast.success("Lesson deleted successfully");
      router.replace(`/instructor/courses/${courseId}`);
    } catch (err) {
      toast.error("Failed to delete lesson");
      console.error("Error deleting lesson:", err);
    } finally {
      setIsSubmitting(false);
      setConfirmOpen(false);
    }
  };

  if (error) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <div className="text-red-600">
          <p>Error loading lesson: {error.message || "Unknown error"}</p>
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
    return <DetailsSectionSkeleton />;
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">{lesson.title}</h1>
        <div className="flex space-x-2">
          <Button
            onClick={() => setIsLessonModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white"
            disabled={isLoading || isSubmitting}
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit Lesson
          </Button>
          <Button
            onClick={handleOpenConfirm}
            className="bg-red-600 hover:bg-red-700 text-white"
            disabled={isLoading || isSubmitting}
          >
            Delete
          </Button>
          <Button
            onClick={handleTogglePublish}
            className={`${
              lesson.status === "PUBLISHED"
                ? "bg-yellow-600 hover:bg-yellow-700"
                : "bg-black hover:bg-black"
            } text-white`}
            disabled={isLoading || isSubmitting}
          >
            {lesson.status === "PUBLISHED" ? "Make Draft" : "Publish"}
          </Button>
        </div>
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
          <span className="font-semibold">Status:</span>{" "}
          <StatusBadge isActive={!lesson.deletedAt} />
        </p>
        <p>
          <span className="font-semibold">Stage:</span>{" "}
          {lesson.status === "PUBLISHED" ? (
            <span className="text-green-500">Published</span>
          ) : (
            <span className="text-red-500">Draft</span>
          )}
        </p>
        <p>
          <span className="font-semibold">Created At:</span>{" "}
          {formatDate(lesson.createdAt)}
        </p>
        <p>
          <span className="font-semibold">Updated At:</span>{" "}
          {formatDate(lesson.updatedAt)}
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
          status: lesson.status,
        }}
        courseId={courseId}
        isSubmitting={isSubmitting}
      />

      <AlertComponent
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Are you sure?"
        description="Are you sure you want to delete this lesson? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
