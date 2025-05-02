"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Edit,
  Trash2,
  Eye,
  EyeOff,
  ArrowUpRight,
  CalendarClock,
  Hash,
  StickyNote,
} from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

// Component imports
import { Button } from "@/components/ui/button";
import { LessonFormModal } from "@/components/lesson/LessonFormModal";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { AlertComponent } from "../ui/AlertComponent";
import { DetailsSectionSkeleton } from "../skeleton/CourseDetailSectionSkeleton";

// Utilities and API
import { formatDate } from "@/utils/formatDate";
import { deleteLesson } from "@/api/lesson";
import { ILesson } from "@/types/lesson";
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
      toast.error("Failed to update lesson");
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
      lessonSchema.parse(data);
      onUpdateLesson(data);
    } catch (err) {
      console.error("Error updating lesson status:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenConfirm = () => setConfirmOpen(true);

  const handleConfirmDelete = async () => {
    if (!lesson.id) {
      toast.error("Lesson ID is missing");
      return;
    }

    setIsSubmitting(true);
    try {
      await deleteLesson(lesson.id);
      router.replace(`/instructor/courses/${courseId}`);
    } catch (err) {
      console.error("Error deleting lesson:", err);
    } finally {
      setIsSubmitting(false);
      setConfirmOpen(false);
    }
  };

  if (error) {
    return (
      <div className="bg-white rounded-lg p-8 shadow-md border border-red-100">
        <div className="text-red-600">
          <p className="text-lg">
            Error loading lesson: {error.message || "Unknown error"}
          </p>
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
    <div className=" overflow-hidden">
      {/* Header section */}
      <div className="border-b border-gray-100 p-2">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <h1 className="text-2xl font-bold text-gray-800">{lesson.title}</h1>
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={() => setIsLessonModalOpen(true)}
              className="bg-gray-100 text-gray-800 border-b-2 border-gray-400 hover:bg-gray-200 transition-all duration-200 shadow-sm"
              disabled={isLoading || isSubmitting}
              size="sm"
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>

            <Button
              onClick={handleTogglePublish}
              className={`${
                lesson.status === "PUBLISHED"
                  ? "bg-gray-200 text-gray-700"
                  : "bg-white text-gray-800 border-b-2 border-gray-400"
              } hover:bg-gray-100 transition-all duration-200 shadow-sm`}
              disabled={isLoading || isSubmitting}
              size="sm"
            >
              {lesson.status === "PUBLISHED" ? (
                <>
                  <EyeOff className="mr-2 h-4 w-4" />
                  Unpublish
                </>
              ) : (
                <>
                  <Eye className="mr-2 h-4 w-4" />
                  Publish
                </>
              )}
            </Button>

            <Button
              onClick={handleOpenConfirm}
              className="bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200 shadow-sm"
              disabled={isLoading || isSubmitting}
              size="sm"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>
      </div>

      {/* Lesson details */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <StickyNote className="h-5 w-5 text-gray-400 mt-1" />
              <div>
                <h3 className="text-gray-500 font-medium text-sm">
                  Description
                </h3>
                <p className="text-gray-800">
                  {lesson.description || "No description provided"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Hash className="h-5 w-5 text-gray-400" />
              <div>
                <h3 className="text-gray-500 font-medium text-sm">Order</h3>
                <p className="text-gray-800">{lesson.order}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <CalendarClock className="h-5 w-5 text-gray-400" />
              <div>
                <h3 className="text-gray-500 font-medium text-sm">Created</h3>
                <p className="text-gray-800">{formatDate(lesson.createdAt)}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <CalendarClock className="h-5 w-5 text-gray-400" />
              <div>
                <h3 className="text-gray-500 font-medium text-sm">
                  Last Updated
                </h3>
                <p className="text-gray-800">{formatDate(lesson.updatedAt)}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <ArrowUpRight className="h-5 w-5 text-gray-400" />
              <div>
                <h3 className="text-gray-500 font-medium text-sm">Status</h3>
                <div className="flex items-center gap-3 mt-1">
                  <StatusBadge isActive={!lesson.deletedAt} />
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      lesson.status === "PUBLISHED"
                        ? "bg-green-100 text-green-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {lesson.status === "PUBLISHED" ? "Published" : "Draft"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
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
        title="Delete Lesson"
        description="Are you sure you want to delete this lesson? This action cannot be undone and all associated content will be permanently removed."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
