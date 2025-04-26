import { LessonContent } from "@/types/lesson";

export const dummyLessonContents: LessonContent = 
  {
    id: "content-1",
    lessonId: "lesson-1",
    type: "VIDEO",
    status: "PUBLISHED",
    data: {
      title: "Introduction Video",
      description: "An introductory video for the lesson.",
      fileUrl: "https://example.com/video.mp4",
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    deletedAt: null,
  }
  