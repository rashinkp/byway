export enum ContentType {
  VIDEO = "VIDEO",
  DOCUMENT = "DOCUMENT",
  QUIZ = "QUIZ",
}

export enum ContentStatus {
  DRAFT = "DRAFT",
  PROCESSING = "PROCESSING",
  PUBLISHED = "PUBLISHED",
  ERROR = "ERROR",
}

export interface LessonContent {
  id: string;
  lessonId: string;
  type: ContentType;
  status: ContentStatus;
  data: {
    title: string;
    description?: string | null;
    fileUrl?: string;
    questions?: { question: string; options: string[]; answer: string }[];
  };
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export interface CreateLessonContentInput {
  lessonId: string;
  type: ContentType;
  status?: ContentStatus;
  data: {
    title: string;
    description?: string | null;
    fileUrl?: string;
    questions?: { question: string; options: string[]; answer: string }[];
  };
}

export interface UpdateLessonContentInput {
  id: string;
  type?: ContentType;
  status?: ContentStatus;
  data?: {
    title?: string;
    description?: string | null;
    fileUrl?: string;
    questions?: { question: string; options: string[]; answer: string }[];
  };
}
