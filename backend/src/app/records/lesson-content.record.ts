export interface LessonContentRecord {
  id: string;
  lessonId: string;
  contentType: "VIDEO" | "DOCUMENT" | "QUIZ" | "ASSIGNMENT";
  title: string;
  description?: string | null;
  contentUrl?: string | null;
  duration?: number | null;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  createdAt: Date;
  updatedAt: Date;
} 