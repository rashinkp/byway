import { z } from "zod";
import { courseEditSchema } from "@/lib/validations/course";

export type SortByType = "createdAt" | "name" | "updatedAt";

export interface Course {
  id: string;
  title: string;
  description?: string | null;
  level: "BEGINNER" | "MEDIUM" | "ADVANCED";
  price?: number | null;
  thumbnail?: string | null;
  duration?: number | null;
  offer?: number | null;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  categoryId: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
  details?: {
    prerequisites?: string | null;
    longDescription?: string | null;
    objectives?: string | null;
    targetAudience?: string | null;
  } | null;
}

export interface AddCourseParams {
  title: string;
  description?: string | null;
  categoryId: string;
  price?: number | null;
  duration?: number | null;
  level: "BEGINNER" | "MEDIUM" | "ADVANCED";
  thumbnail?: string | null;
  offer?: number | null;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  details?: {
    prerequisites?: string | null;
    longDescription?: string | null;
    objectives?: string | null;
    targetAudience?: string | null;
  } | null;
}

export interface CourseFormData {
  title: string;
  description?: string;
  longDescription?: string;
  status?: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  categoryId: string;
  price?: number;
  offer?: number;
  duration: number;
  level: "BEGINNER" | "MEDIUM" | "ADVANCED";
  prerequisites?: string;
  objectives?: string;
  targetAudience?: string;
  thumbnail?: string | File;
}

interface CourseApiResponse {
  courses: Course[];
  total: number;
  totalPage: number;
}

export type CourseEditFormData = z.infer<typeof courseEditSchema>;

export type SortByField = "title" | "createdAt";
export type NegativeSortByField = `-${SortByField}`;

export interface IGetAllCoursesInput {
  page?: number;
  limit?: number;
  sortBy?: "title" | "createdAt" | "updatedAt";
  sortOrder?: "asc" | "desc";
  includeDeleted?: boolean;
  search?: string;
  filterBy?: "All" | "Active" | "Draft" | "Inactive";
  userId?: string;
  myCourses?: boolean;
  role?: "USER" | "INSTRUCTOR" | "ADMIN";
}