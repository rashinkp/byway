import { z } from "zod";
import {
  ICreateLessonContentInputDTO,
  IUpdateLessonContentInputDTO,
} from "../../app/dtos/lesson.dto";
import { ContentType, ContentStatus } from "../../domain/enum/content.enum";

interface ValidationSchema {
  body?: z.ZodSchema;
  query?: z.ZodSchema;
  params?: z.ZodSchema;
}

// QuizQuestion schema
const quizQuestionSchema = z.object({
  id: z.string().uuid("Invalid quiz question ID").optional(),
  question: z.string().min(1, "Question is required"),
  options: z.array(z.string()).min(2, "At least two options are required"),
  correctAnswer: z.string().min(1, "Correct answer is required"),
});

// CreateLessonContent schema
const createLessonContentSchema = z.object({
  lessonId: z.string().uuid("Invalid lesson ID"),
  type: z.enum([ContentType.VIDEO, ContentType.QUIZ, ContentType.DOCUMENT], {
    message: "Invalid content type",
  }),
  status: z.enum([ContentStatus.DRAFT, ContentStatus.PUBLISHED]).optional(),
  title: z.string().nullish(),
  description: z.string().nullish(),
  // Accept S3 key or any non-empty path string
  fileUrl: z.string().min(1).nullish(),
  thumbnailUrl: z.string().min(1).nullish(),
  quizQuestions: z.array(quizQuestionSchema).nullish(),
});

// UpdateLessonContent schema
const updateLessonContentSchema = z.object({
  id: z.string().uuid("Invalid content ID"),
  type: z
    .enum([ContentType.VIDEO, ContentType.QUIZ, ContentType.DOCUMENT], {
      message: "Invalid content type",
    })
    .optional(),
  status: z.enum([ContentStatus.DRAFT, ContentStatus.PUBLISHED]).optional(),
  title: z.string().nullish(),
  description: z.string().nullish(),
  // Accept S3 key or any non-empty path string
  fileUrl: z.string().min(1).nullish(),
  thumbnailUrl: z.string().min(1).nullish(),
  quizQuestions: z.array(quizQuestionSchema).nullish(),
});

// GetLessonContentById schema
const getLessonContentByIdSchema = z.object({
  id: z.string().uuid("Invalid content ID"),
});

// GetLessonContentByLessonId schema
const getLessonContentByLessonIdSchema = z.object({
  lessonId: z.string().uuid("Invalid lesson ID"),
});

// DeleteLessonContent schema
const deleteLessonContentSchema = z.object({
  id: z.string().uuid("Invalid content ID"),
});

// Validation schemas for endpoints
export const createLessonContentSchemaDef: ValidationSchema = {
  body: createLessonContentSchema,
};

export const updateLessonContentSchemaDef: ValidationSchema = {
  body: updateLessonContentSchema.omit({ id: true }),
  params: z.object({ id: z.string().uuid("Invalid content ID") }),
};

export const getLessonContentByIdSchemaDef: ValidationSchema = {
  params: getLessonContentByIdSchema,
};

export const getLessonContentByLessonIdSchemaDef: ValidationSchema = {
  params: getLessonContentByLessonIdSchema,
};

export const deleteLessonContentSchemaDef: ValidationSchema = {
  params: deleteLessonContentSchema,
};

// Validation functions
export function validateCreateLessonContent(
  data: unknown
): ICreateLessonContentInputDTO {
  return createLessonContentSchema.parse(data);
}

export function validateUpdateLessonContent(
  data: unknown
): IUpdateLessonContentInputDTO {
  return updateLessonContentSchema.parse(data);
}

export function validateGetLessonContentById(data: unknown): { id: string } {
  return getLessonContentByIdSchema.parse(data);
}

export function validateGetLessonContentByLessonId(data: unknown): {
  lessonId: string;
} {
  return getLessonContentByLessonIdSchema.parse(data);
}

export function validateDeleteLessonContent(data: unknown): { id: string } {
  return deleteLessonContentSchema.parse(data);
}
