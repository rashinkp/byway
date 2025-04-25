// src/types/lesson.ts
export interface ILesson {
  id: string;
  courseId: string;
  title: string;
  description?: string | null;
  order: number;
  thumbnail?: string | null;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
  deletedAt?: string | null; // ISO string
  duration?: number; // Add if supported by backend
  videoUrl?: string; // Add if part of LessonContent
}
export interface GetAllLessonsResponse {
  lessons: ILesson[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Parameters for getAllLessonsInCourse
export interface GetAllLessonsParams {
  courseId: string;
  page?: number;
  limit?: number;
  sortBy?: "order" | "title" | "createdAt" | "updatedAt";
  sortOrder?: "asc" | "desc";
  search?: string;
  filterBy?: "DRAFT" | "PUBLISHED" | "ALL" | "INACTIVE";
  includeDeleted?: boolean;
}

export interface UseGetAllLessonsInCourseParams {
  courseId: string;
  page?: number;
  limit?: number;
  sortBy?: "order" | "title" | "createdAt" | "updatedAt";
  sortOrder?: "asc" | "desc";
  search?: string;
  filterBy?: "DRAFT" | "PUBLISHED" | "ALL" | "INACTIVE";
  includeDeleted?: boolean;
}

export interface ICreateLessonInput {
  courseId: string;
  title: string;
  description?: string | null;
  order: number;
  thumbnail?: string | null;
}


// src/types/lesson.ts
export interface UpdateLessonInput {
  lessonId: string;
  title?: string;
  description?: string;
  order?: number;
  thumbnail?: string;
  duration?: number;
}

// src/types/lessonContent.ts
export type ContentType = "VIDEO" | "QUIZ" | "DOC";
export type ContentStatus = "DRAFT" | "PUBLISHED";

export interface LessonContent {
  id: string;
  lessonId: string;
  type: ContentType;
  status: ContentStatus;
  data: {
    fileUrl?: string; // For VIDEO and DOC
    questions?: { question: string; options: string[]; answer: string }[]; // For QUIZ
  };
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export interface LessonContentFormData {
  type: ContentType;
  status: ContentStatus;
  data: {
    fileUrl?: string;
    questions?: { question: string; options: string[]; answer: string }[];
  };
}