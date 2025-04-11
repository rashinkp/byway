// src/modules/course/types.ts
export interface ICourse {
  id: string;
  title: string;
  description?: string;
  level: "BEGINNER" | "MEDIUM" | "ADVANCED";
  price?: number;
  thumbnail?: string;
  duration?: number;
  offer?: number;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  categoryId: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
  details?: ICourseDetails;
}

export interface ICourseDetails {
  id: string;
  courseId: string;
  prerequisites?: string;
  longDescription?: string;
  objectives?: string;
  targetAudience?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateCourseInput {
  title: string;
  description?: string;
  level?: "BEGINNER" | "MEDIUM" | "ADVANCED";
  price?: number;
  thumbnail?: string;
  duration?: number;
  offer?: number;
  status?: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  categoryId: string;
  createdBy: string;
  details?: {
    prerequisites?: string;
    longDescription?: string;
    objectives?: string;
    targetAudience?: string;
  };
}

export interface IUpdateCourseInput {
  id: string;
  title?: string;
  description?: string;
  level?: "BEGINNER" | "MEDIUM" | "ADVANCED";
  price?: number;
  thumbnail?: string;
  duration?: number;
  offer?: number;
  status?: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  categoryId?: string;
  createdBy: string;
  details?: {
    prerequisites?: string;
    longDescription?: string;
    objectives?: string;
    targetAudience?: string;
  };
}

export interface IGetAllCoursesInput {
  page?: number;
  limit?: number;
  sortBy?: "title" | "createdAt" | "updatedAt";
  sortOrder?: "asc" | "desc";
  includeDeleted?: boolean;
}
