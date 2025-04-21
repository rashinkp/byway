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
  filterBy?: "DRAFT" | "PUBLISHED" | "ALL";
  includeDeleted?: boolean;
}

export interface UseGetAllLessonsInCourseParams {
  courseId: string;
  page?: number;
  limit?: number;
  sortBy?: "order" | "title" | "createdAt" | "updatedAt";
  sortOrder?: "asc" | "desc";
  search?: string;
  filterBy?: "DRAFT" | "PUBLISHED" | "ALL";
  includeDeleted?: boolean;
}
