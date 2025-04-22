// src/pages/instructor/courses/[courseId]/lessons/[lessonId].tsx
"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { dummyLessonContents } from "../dummyData";
import {
  ILesson,
  LessonContent,
  LessonContentFormData,
  UpdateLessonInput,
} from "@/types/lesson";
import { LessonFormData } from "@/components/lesson/LessonFormModal";
import { LessonDetailSection } from "@/components/lesson/LessonDetailSection";
import { ContentSection } from "@/components/lesson/LessonContentSection";
import { useGetLessonById } from "@/hooks/lesson/useGetLessonById";
import { useUpdateLesson } from "@/hooks/lesson/useUpdateLesson";
import { toast } from "sonner";

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
  const [contents, setContents] =
    useState<LessonContent[]>(dummyLessonContents);

  const nextOrder = 2;

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
      thumbnail: data.thumbnail || undefined,
      duration: lesson.duration,
    };

    updateLesson(updateData, {
      onSuccess: () => {
        toast.success("Lesson updated successfully");
      },
      onError: (err) => {
        toast.error(`Failed to update lesson: ${err.message}`);
      },
    });
  };

  const handleAddContent = (data: LessonContentFormData) => {
    if (!lesson?.id) {
      toast.error("Lesson ID is required");
      return;
    }
    const newContent: LessonContent = {
      id: `content-${contents.length + 1}`,
      lessonId: lesson.id,
      type: data.type,
      status: data.status,
      data: data.data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deletedAt: null,
    };
    setContents((prev) => [...prev, newContent]);
    toast.success("Content created successfully");
  };

  const handleEditContent = (
    data: LessonContentFormData,
    contentId: string
  ) => {
    setContents((prev) =>
      prev.map((content) =>
        content.id === contentId
          ? { ...content, ...data, updatedAt: new Date().toISOString() }
          : content
      )
    );
    toast.success("Content updated successfully");
  };

  const handleDeleteContent = (content: LessonContent) => {
    setContents((prev) =>
      prev.map((c) =>
        c.id === content.id
          ? {
              ...c,
              deletedAt: c.deletedAt ? null : new Date().toISOString(),
            }
          : c
      )
    );
    toast.success(
      content.deletedAt
        ? "Content restored successfully"
        : "Content deleted successfully"
    );
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-6 space-y-8">
        <div className="bg-white shadow rounded-lg p-6" data-testid="skeleton">
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
        <div className="bg-white shadow rounded-lg p-6">
          <div className="h-6 w-1/3 bg-gray-200 rounded animate-pulse" />
        </div>
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

  return (
    <div className="container mx-auto py-6 space-y-8">
      <LessonDetailSection
        lesson={lesson as ILesson}
        isLoading={isLoading || isUpdating}
        error={error || updateError}
        courseId={courseId as string}
        nextOrder={nextOrder}
        onUpdateLesson={handleEditLesson}
        onRetry={() => refetch()}
      />
      <ContentSection
        contents={contents}
        lessonId={lessonId as string}
        onAddContent={handleAddContent}
        onEditContent={handleEditContent}
        onDeleteContent={handleDeleteContent}
      />
    </div>
  );
}
