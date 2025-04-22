// src/pages/instructor/courses/[courseId]/lessons/[lessonId].tsx
"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { dummyLesson, dummyLessonContents } from "../dummyData";
import { ILesson } from "@/types/lesson";
import {
  LessonContent,
  LessonContentFormData,
} from "@/types/lesson";
import { LessonDetailSection } from "@/components/lesson/LessonDetailSection";
import { ContentSection } from "@/components/lesson/LessonContentSection";
import { LessonFormData } from "@/components/lesson/LessonFormModal";

export default function LessonDetailPage() {
  const { courseId, lessonId } = useParams();

  const [lesson, setLesson] = useState<ILesson>(dummyLesson);
  const [contents, setContents] =
    useState<LessonContent[]>(dummyLessonContents);

  const nextOrder = 2;

  const handleEditLesson = (data: LessonFormData) => {
    setLesson((prev) => ({
      ...prev,
      title: data.title,
      description: data.description,
      order: data.order,
      thumbnail: data.thumbnail,
    }));
  };

  const handleAddContent = (data: LessonContentFormData) => {
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
  };

  return (
    <div className="container mx-auto py-6 space-y-8">
      <LessonDetailSection
        lesson={lesson}
        courseId={courseId as string}
        nextOrder={nextOrder}
        onUpdateLesson={handleEditLesson}
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
