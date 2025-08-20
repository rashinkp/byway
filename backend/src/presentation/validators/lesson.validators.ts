import { z } from "zod";
import {
  ICreateLessonInputDTO,
  IUpdateLessonInputDTO,
  IGetAllLessonsInputDTO,
  IGetPublicLessonsInputDTO,
} from "../../app/dtos/lesson.dto";
import { ContentStatus, ContentType } from "../../domain/enum/content.enum";
import { LessonStatus } from "../../domain/enum/lesson.enum";

interface ValidationSchema {
  body?: z.ZodSchema;
  query?: z.ZodSchema;
  params?: z.ZodSchema;
}

// QuizQuestion schema
const quizQuestionSchema = z.object({
  id: z.string().uuid("Invalid quiz question ID").optional(), // Made optional
  question: z.string().min(1, "Question is required"),
  options: z.array(z.string()).min(2, "At least two options are required"),
  correctAnswer: z.string().min(1, "Correct answer is required"),
});

// LessonContent schema (used in create and update)
const lessonContentSchema = z.object({
  id: z.string().uuid(),
  lessonId: z.string().uuid("Invalid lesson ID"),
  type: z.enum([ContentType.VIDEO, ContentType.QUIZ, ContentType.DOCUMENT], {
    message: "Invalid content type",
  }),
  status: z.enum([ContentStatus.DRAFT, ContentStatus.PUBLISHED], {
    message: "Invalid content status",
  }),
  title: z.string().nullish(),
  description: z.string().nullish(),
  // Accept either a full URL or an S3 key
  fileUrl: z.union([z.string().url(), z.string().min(1)]).nullish(),
  thumbnailUrl: z.union([z.string().url(), z.string().min(1)]).nullish(),
  quizQuestions: z.array(quizQuestionSchema).nullish(),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
  deletedAt: z.string().datetime().nullish(),
});

// CreateLesson schema
const createLessonSchema = z.object({
  courseId: z.string().uuid("Invalid course ID"),
  title: z.string().min(1, "Title is required"),
  description: z.string().nullish(),
  order: z.number().int().min(1, "Order must be a positive integer"),
  status: z.enum([LessonStatus.DRAFT, LessonStatus.PUBLISHED]).optional(),
  content: lessonContentSchema.nullish(),
  // Accept either a full URL or an S3 key
  thumbnail: z.union([z.string().url(), z.string().min(1)]).nullish(),
  duration: z.number().int().min(0).nullish(),
});

// UpdateLesson schema
const updateLessonSchema = z.object({
  lessonId: z.string().uuid("Invalid lesson ID"),
  title: z.string().min(1, "Title is required").optional(),
  description: z.string().nullish(),
  order: z.number().int().min(1, "Order must be a positive integer").optional(),
  status: z.enum([LessonStatus.DRAFT, LessonStatus.PUBLISHED]).optional(),
  content: lessonContentSchema.nullish(),
  // Accept either a full URL or an S3 key
  thumbnail: z.union([z.string().url(), z.string().min(1)]).nullish(),
  duration: z.number().int().min(0).nullish(),
});

// GetLessonById schema
const getLessonByIdSchema = z.object({
  lessonId: z.string().uuid("Invalid lesson ID"),
});

// GetAllLessons schema
const getAllLessonsSchema = z.object({
  courseId: z.string().uuid("Invalid course ID"),
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).optional().default(10),
  sortBy: z
    .enum(["order", "title", "createdAt", "updatedAt"])
    .optional()
    .default("order"),
  sortOrder: z.enum(["asc", "desc"]).optional().default("asc"),
  search: z.string().optional(),
  filterBy: z
    .enum(["DRAFT", "PUBLISHED", "ALL", "INACTIVE"])
    .optional()
    .default("ALL"),
  includeDeleted: z.coerce.boolean().optional().default(false),
});

// DeleteLesson schema
const deleteLessonSchema = z.object({
  lessonId: z.string().uuid("Invalid lesson ID"),
});

// GetPublicLessons schema
const getPublicLessonsSchema = z.object({
  courseId: z.string().uuid("Invalid course ID"),
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).optional().default(10),
  sortBy: z
    .enum(["order", "title", "createdAt", "updatedAt"])
    .optional()
    .default("order"),
  sortOrder: z.enum(["asc", "desc"]).optional().default("asc"),
  search: z.string().optional(),
});

// Validation schemas for endpoints
export const createLessonSchemaDef: ValidationSchema = {
  body: createLessonSchema,
};

export const updateLessonSchemaDef: ValidationSchema = {
  body: updateLessonSchema.omit({ lessonId: true }),
  params: z.object({ lessonId: z.string().uuid("Invalid lesson ID") }),
};

export const getLessonByIdSchemaDef: ValidationSchema = {
  params: getLessonByIdSchema,
};

export const getAllLessonsSchemaDef: ValidationSchema = {
  query: getAllLessonsSchema.omit({ courseId: true }),
  params: z.object({ courseId: z.string().uuid("Invalid course ID") }),
};

export const deleteLessonSchemaDef: ValidationSchema = {
  params: deleteLessonSchema,
};

export const getPublicLessonsSchemaDef: ValidationSchema = {
  query: getPublicLessonsSchema.omit({ courseId: true }),
  params: z.object({ courseId: z.string().uuid("Invalid course ID") }),
};

// Validation functions
export function validateCreateLesson(data: unknown): ICreateLessonInputDTO {
  return createLessonSchema.parse(data);
}

export function validateUpdateLesson(data: unknown): IUpdateLessonInputDTO {
  return updateLessonSchema.parse(data);
}

export function validateGetLessonById(data: unknown): { lessonId: string } {
  return getLessonByIdSchema.parse(data);
}

export function validateGetAllLessons(data: unknown): IGetAllLessonsInputDTO {
  return getAllLessonsSchema.parse(data);
}

export function validateDeleteLesson(data: unknown): { lessonId: string } {
  return deleteLessonSchema.parse(data);
}

export function validateGetPublicLessons(
  data: unknown
): IGetPublicLessonsInputDTO {
  return getPublicLessonsSchema.parse(data);
}
