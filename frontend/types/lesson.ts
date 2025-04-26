// src/types/lesson.ts
export interface ILesson {
  id: string;
  courseId: string;
  title: string;
  description?: string | null;
  order: number;
  status: "DRAFT" | "PUBLISHED" ;
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
}


// src/types/lesson.ts
export interface UpdateLessonInput {
  lessonId: string;
  title?: string;
  description?: string;
  order?: number;
  duration?: number;
}

// src/types/lessonContent.ts
export type ContentType = "VIDEO" | "QUIZ" | "DOC";
export type ContentStatus = "DRAFT" | "PUBLISHED";

export interface LessonContent {
  id: string;
  lessonId: string;
  type: "VIDEO" | "DOC" | "QUIZ";
  status: "DRAFT" | "PUBLISHED";
  data: {
    title?: string;
    description?: string;
    fileUrl?: string;
    questions?: { question: string; options: string[]; answer: string }[];
  };
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface LessonContentFormData {
  type: "VIDEO" | "DOC" | "QUIZ";
  status: "DRAFT" | "PUBLISHED";
  data: {
    title?: string;
    description?: string;
    fileUrl?: string;
    questions?: { question: string; options: string[]; answer: string }[];
  };
}
