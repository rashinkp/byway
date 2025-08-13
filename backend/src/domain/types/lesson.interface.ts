import { QuizQuestion } from "../entities/content.entity";
import { ContentStatus, ContentType } from "../enum/content.enum";
import { LessonStatus } from "../enum/lesson.enum";

// Lesson Content Interface
export interface ILessonContent {
  id: string;
  lessonId: string;
  type: ContentType;
  status: ContentStatus;
  title?: string | null;
  description?: string | null;
  fileUrl?: string | null;
  thumbnailUrl?: string | null;
  quizQuestions?: QuizQuestion[] | null;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

// Lesson Output Interface
export interface ILessonOutput {
  id: string;
  courseId: string;
  title: string;
  description?: string | null;
  order: number;
  status: LessonStatus;
  content?: ILessonContent | null;
  thumbnail?: string | null;
  duration?: number | null;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

// Public Lesson Output Interface (for public-facing data)
export interface IPublicLessonOutput {
  id: string;
  title: string;
  description?: string | null;
  order: number;
  thumbnail?: string | null;
  duration?: number | null;
}

// Lesson Filter Options Interface
export interface ILessonFilterOptions {
  courseId: string;
  page?: number;
  limit?: number;
  sortBy?: "order" | "title" | "createdAt" | "updatedAt";
  sortOrder?: "asc" | "desc";
  search?: string;
  filterBy?: "DRAFT" | "PUBLISHED" | "ALL" | "INACTIVE";
  includeDeleted?: boolean;
}

// Public Lesson Filter Options Interface
export interface IPublicLessonFilterOptions {
  courseId: string;
  page?: number;
  limit?: number;
  sortBy?: "order" | "title" | "createdAt" | "updatedAt";
  sortOrder?: "asc" | "desc";
  search?: string;
}

// Lesson List Response Interface
export interface ILessonListResponse {
  lessons: ILessonOutput[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Public Lesson List Response Interface
export interface IPublicLessonListResponse {
  lessons: IPublicLessonOutput[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
