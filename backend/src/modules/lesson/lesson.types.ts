import { LessonContent } from "@prisma/client";

export interface ILesson {
  id: string;
  courseId: string;
  title: string;
  description?: string | null;
  order: number;
  status: "DRAFT" | "PUBLISHED";
  content?: LessonContent | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}

export interface ICreateLessonInput {
  courseId: string;
  title: string;
  description?: string | null;
  order: number;
  deletedAt?: Date | null;
  status?: "DRAFT" | "PUBLISHED";
}

export interface IUserLessonProgress {
  userId: string;
  courseId: string;
  lessonId: string;
  completed: boolean;
  completedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUpdateLessonProgressInput {
  userId: string;
  courseId: string;
  lessonId: string;
  completed: boolean;
}

export interface IGetProgressInput {
  userId: string;
  courseId: string;
}

export interface IGetAllLessonsInput {
  courseId: string;
  userId: string;
  page?: number;
  limit?: number;
  sortBy?: "order" | "title" | "createdAt" | "updatedAt";
  sortOrder?: "asc" | "desc";
  search?: string;
  filterBy?: "DRAFT" | "PUBLISHED" | "ALL";
  includeDeleted?: boolean;
}
export interface IGetAllLessonsResponse {
  lessons: ILesson[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

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

export interface ICreateLessonContentInput {
  lessonId: string;
  type: ContentType;
  status?: ContentStatus;
  data: Record<string, any>;
}

export interface IGetPublicLessonsInput {
  courseId: string;
  page?: number;
  limit?: number;
  sortBy?: "order" | "title" | "createdAt" | "updatedAt";
  sortOrder?: "asc" | "desc";
  search?: string;
}


export interface IGetPublicLessonsResponse {
  lessons: {
    id: string;
    title: string;
    description?: string | null;
    order: number;
  }[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
