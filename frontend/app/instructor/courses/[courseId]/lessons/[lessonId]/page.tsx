"use client";

import { useParams } from "next/navigation";
import { ILesson, UpdateLessonInput } from "@/types/lesson";
import { LessonFormData } from "@/components/lesson/LessonFormModal";
import { LessonDetailSection } from "@/components/lesson/LessonDetailSection";
import { toast } from "sonner";
import { useGetLessonById } from "@/hooks/lesson/useGetLessonById";
import { useUpdateLesson } from "@/hooks/lesson/useUpdateLesson";
import { ContentSection } from "@/components/content/ContentSection";
import { LessonDetailSectionSkeleton } from "@/components/skeleton/LessonDetailSection";
import { ContentSectionSkeleton } from "@/components/skeleton/LessonContentSectionSkeleton";

export default function LessonDetailPage() {
  const { courseId, lessonId } = useParams();

  const {
    data: lesson,
    isLoading,
    error,
    refetch,
  } = useGetLessonById(lessonId as string);
  const {
    mutate: updateLesson,
    isPending: isUpdating,
    error: updateError,
  } = useUpdateLesson();

  const nextOrder = 2; // Adjust based on your logic

  const handleEditLesson = (data: LessonFormData) => {
    if (!lesson?.id) {
      toast.error("Lesson ID is required");
      return;
    }

    const updateData: UpdateLessonInput = {
      lessonId: lesson.id,
      title: data.title,
      description: data.description || undefined,
      order: data.order,
    };

    updateLesson(updateData, {
      onSuccess: () => {
        toast.success("Lesson updated", {
          description: "Lesson details have been updated.",
        });
      },
      onError: (err) => {
        toast.error(`Failed to update lesson: ${err.message}`, {
          description: "Please try again later.",
        });
      },
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-6 space-y-8">
        <LessonDetailSectionSkeleton />
        <ContentSectionSkeleton />
      </div>
    );
  }

  if (error || updateError) {
    return (
      <div className="container mx-auto py-6 space-y-8">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="text-red-600">
            <p>Error: {(error || updateError)?.message}</p>
            <button
              onClick={() => refetch()}
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="container mx-auto py-6 space-y-8">
        <div className="bg-white shadow rounded-lg p-6">
          <p>No lesson found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-8">
      <LessonDetailSection
        lesson={lesson}
        isLoading={isLoading || isUpdating}
        error={error || updateError}
        courseId={courseId as string}
        nextOrder={nextOrder}
        onUpdateLesson={handleEditLesson}
        onRetry={() => refetch()}
      />
      <ContentSection lessonId={lesson.id} />
    </div>
  );
}
