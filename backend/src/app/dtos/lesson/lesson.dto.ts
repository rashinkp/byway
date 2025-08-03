import { QuizQuestion } from "../../../domain/entities/lesson-content.entity";
import { ContentStatus, ContentType } from "../../../domain/enum/content.enum";
import { LessonStatus } from "../../../domain/enum/lesson.enum";

export interface ILessonOutputDTO {
  id: string;
  courseId: string;
  title: string;
  description?: string | null;
  order: number;
  status: LessonStatus;
  content?: ILessonContentOutputDTO | null;
  thumbnail?: string | null;
  duration?: number | null;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export interface IPublicLessonOutputDTO {
  id: string;
  title: string;
  description?: string | null;
  order: number;
  thumbnail?: string | null;
  duration?: number | null;
}

export interface ILessonContentOutputDTO {
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

export interface ILessonContentInputDTO {
  id?: string; // Optional for create, required for update
  lessonId: string;
  type: ContentType;
  status: ContentStatus;
  title?: string | null;
  description?: string | null;
  fileUrl?: string | null;
  thumbnailUrl?: string | null;
  quizQuestions?: QuizQuestion[] | null;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
}

export interface IGetAllLessonsInputDTO {
  courseId: string;
  page?: number;
  limit?: number;
  sortBy?: "order" | "title" | "createdAt" | "updatedAt";
  sortOrder?: "asc" | "desc";
  search?: string;
  filterBy?: "DRAFT" | "PUBLISHED" | "ALL" | "INACTIVE";
  includeDeleted?: boolean;
}

export interface IGetPublicLessonsInputDTO {
  courseId: string;
  page?: number;
  limit?: number;
  sortBy?: "order" | "title" | "createdAt" | "updatedAt";
  sortOrder?: "asc" | "desc";
  search?: string;
}

export interface ICreateLessonInputDTO {
  courseId: string;
  title: string;
  description?: string | null;
  order: number;
  status?: LessonStatus;
  content?: ILessonContentInputDTO | null;
  thumbnail?: string | null;
  duration?: number | null;
}

export interface IUpdateLessonInputDTO {
  lessonId: string;
  title?: string;
  description?: string | null;
  order?: number;
  status?: LessonStatus;
  content?: ILessonContentInputDTO | null;
  thumbnail?: string | null;
  duration?: number | null;
}

export interface ICreateLessonContentInputDTO {
  lessonId: string;
  type: ContentType;
  status?: ContentStatus;
  title?: string | null;
  description?: string | null;
  fileUrl?: string | null;
  thumbnailUrl?: string | null;
  quizQuestions?: QuizQuestion[] | null;
}

export interface IUpdateLessonContentInputDTO {
  id: string;
  type?: ContentType;
  status?: ContentStatus;
  title?: string | null;
  description?: string | null;
  fileUrl?: string | null;
  thumbnailUrl?: string | null;
  quizQuestions?: QuizQuestion[] | null;
}

export interface ILessonListOutputDTO {
  lessons: ILessonOutputDTO[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface IPublicLessonListOutputDTO {
  lessons: IPublicLessonOutputDTO[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
