// src/data/dummyData.ts
import { ILesson } from "@/types/lesson";
import { LessonContent } from "@/types/lesson";

export const dummyLesson: ILesson = {
  id: "lesson-1",
  courseId: "course-1",
  title: "Introduction to React",
  description: "Learn the basics of React components and hooks.",
  order: 1,
  thumbnail: "https://example.com/thumbnail.jpg",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  deletedAt: null,
};

export const dummyLessonContents: LessonContent[] = [
  {
    id: "content-1",
    lessonId: "lesson-1",
    type: "VIDEO",
    status: "PUBLISHED",
    data: { fileUrl: "https://example.com/video.mp4" },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    deletedAt: null,
  },
  {
    id: "content-2",
    lessonId: "lesson-1",
    type: "QUIZ",
    status: "DRAFT",
    data: {
      questions: [
        {
          question: "What is a React component?",
          options: ["A", "B", "C"],
          answer: "A",
        },
      ],
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    deletedAt: null,
  },
  {
    id: "content-3",
    lessonId: "lesson-1",
    type: "DOC",
    status: "PUBLISHED",
    data: { fileUrl: "https://example.com/document.pdf" },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    deletedAt: new Date().toISOString(),
  },
];
