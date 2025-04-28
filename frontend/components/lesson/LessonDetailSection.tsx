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
import {  toast } from "sonner";
import { formatDate } from "@/utils/formatDate";
import { AlertComponent } from "../ui/AlertComponent";
import { DetailsSectionSkeleton } from "../skeleton/CourseDetailSectionSkeleton";
import { deleteLesson } from "@/api/lesson";
import { useRouter } from "next/navigation";

interface LessonDetailSectionProps {
  lesson: ILesson;
  courseId: string;
  nextOrder: number;
  onUpdateLesson: (data: LessonFormData) => void;
  isLoading: boolean;
  error: Error | null;
  onRetry?: () => void; 
}


//todo: implement lesson publish and unpublish functionality

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
  const [confirmOpen, setConfirmOpen] = useState(false);

  const router = useRouter();

  const handleEditLesson = async (data: LessonFormData) => {
    setIsSubmitting(true);
    try {
      onUpdateLesson(data);
      setIsLessonModalOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };


  const handleTogglePublish = () => {
  }


    const handleOpenConfirm = () => {
      setConfirmOpen(true);
    };

  const handleConfirmDelete = () => {
    if (lesson.id) {
      deleteLesson(lesson.id);
      router.replace(`/instructor/courses/${courseId}`);
    }
  };
  

   interface Action {
      confirmationMessage: (item: ILesson) => string;
  }
  
   const actions: Action[] = [
     {
       confirmationMessage: (item) =>
         `Are you sure you want to ${!item.deletedAt ? "disable" : "enable"} "${
           item.title
         }"?`,
     },
   ];


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
      <DetailsSectionSkeleton />
    );
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
