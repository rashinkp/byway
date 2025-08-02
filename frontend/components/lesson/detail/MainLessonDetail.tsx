"use client";

import { useParams } from "next/navigation";
import { LessonStatus, UpdateLessonInput } from "@/types/lesson";
import { toast } from "sonner";
import { useGetLessonById } from "@/hooks/lesson/useGetLessonById";
import { useUpdateLesson } from "@/hooks/lesson/useUpdateLesson";
import { z } from "zod";
import { LessonFormData, lessonSchema } from "@/lib/validations/lesson";
import ErrorDisplay from "@/components/ErrorDisplay";
import { LessonDetailSection } from "@/components/lesson/LessonDetailSection";
import { ContentSection } from "@/components/content/ContentSection";
import { ContentSectionSkeleton } from "@/components/skeleton/LessonContentSectionSkeleton";
import { LessonDetailSectionSkeleton } from "@/components/skeleton/LessonDetailSection";

export default function MainLessonDetail() {
  const { courseId, lessonId } = useParams();

  const {
    data: lesson,
    isLoading,
    error,
    refetch,
  } = useGetLessonById(lessonId as string);

  const { mutate: updateLesson, isPending: isUpdating } = useUpdateLesson();

  const handleEditLesson = (data: LessonFormData) => {
    if (!lesson) {
      toast.error("Lesson data is not available");
      return;
    }

    try {
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
      <div className=" min-h-screen py-8">
        <div className="max-w-6xl mx-auto px-4 space-y-8">
          <LessonDetailSectionSkeleton />
          <ContentSectionSkeleton />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className=" min-h-screen py-8">
        <div className="max-w-6xl mx-auto px-4">
          <ErrorDisplay
            title="Unable to Load Lesson"
            description="We encountered an issue while loading the lesson data. Please try again."
            error={error}
            onRetry={() => refetch()}
          />
        </div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className=" min-h-screen py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-white dark:bg-[#232323] rounded-lg p-8 shadow-md border border-gray-200 dark:border-gray-700">
            <p className="text-black dark:text-white text-xl font-medium">No lesson found</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className=" min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-2 space-y-8">
        <LessonDetailSection
          lesson={lesson}
          isLoading={isLoading}
          isUpdating={isUpdating}
          error={error}
          courseId={courseId as string}
          onUpdateLesson={handleEditLesson}
          onRetry={() => refetch()}
        />
        <ContentSection lessonId={lesson.id} />
      </div>
    </div>
  );
}
