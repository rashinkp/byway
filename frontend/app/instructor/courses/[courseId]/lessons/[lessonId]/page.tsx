"use client";

import { useParams } from "next/navigation";
import { ILesson, LessonStatus, UpdateLessonInput} from "@/types/lesson";
import { LessonDetailSection } from "@/components/lesson/LessonDetailSection";
import { toast } from "sonner";
import { useGetLessonById } from "@/hooks/lesson/useGetLessonById";
import { useUpdateLesson } from "@/hooks/lesson/useUpdateLesson";
import { ContentSection } from "@/components/content/ContentSection";

import { ContentSectionSkeleton } from "@/components/skeleton/LessonContentSectionSkeleton";
import { z } from "zod";
import { LessonFormData, lessonSchema } from "@/lib/validations/lesson";
import { LessonDetailSectionSkeleton } from "@/components/skeleton/LessonDetailSection";

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


 

  const handleEditLesson = (data: LessonFormData) => {
    if (!lesson) {
      toast.error("Lesson data is not available");
      return;
    }

    try {
      // Validate data
      lessonSchema.parse(data);

      const updateData: UpdateLessonInput = {
        lessonId: lesson.id,
        title: data.title,
        description: data.description || undefined,
        order: data.order,
        status: (data.status || lesson.status) as LessonStatus,
      };

      updateLesson(updateData);
    } catch (err) {
      const errorMessage =
        err instanceof z.ZodError
          ? err.errors.map((e) => e.message).join(", ")
          : "Invalid lesson data";
      toast.error(errorMessage);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-6 space-y-8">
        <LessonDetailSectionSkeleton />
        <ContentSectionSkeleton />
      </div>
    );
  }

  if (error ) {
    return (
      <div className="container mx-auto py-6 space-y-8">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="text-red-600">
            <p>
              Error: {error?.message || updateError?.message || "Unknown error"}
            </p>
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
        error={error}
        courseId={courseId as string}
        onUpdateLesson={handleEditLesson}
        onRetry={() => refetch()}
      />
      <ContentSection lessonId={lesson.id} />
    </div>
  );
}
