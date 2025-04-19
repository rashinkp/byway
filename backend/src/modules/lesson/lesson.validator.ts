import { z } from "zod";

export const createLessonSchema = z.object({
  courseId: z.string().uuid("Invalid course ID"),
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title must be at most 100 characters"),
  description: z
    .string()
    .max(500, "Description must be at most 500 characters")
    .optional()
    .nullable(),
  order: z.number().int().positive("Order must be a positive integer"),
  thumbnail: z.string().url("Invalid URL").optional().nullable(),
});

export const updateLessonProgressSchema = z.object({
  userId: z.string().uuid("Invalid user ID"),
  courseId: z.string().uuid("Invalid course ID"),
  lessonId: z.string().uuid("Invalid lesson ID"),
  completed: z.boolean({ invalid_type_error: "Completed must be a boolean" }),
});

export const getProgressSchema = z.object({
  userId: z.string().uuid("Invalid user ID"),
  courseId: z.string().uuid("Invalid course ID"),
});

export const lessonIdSchema = z.object({
  id: z.string().uuid("Invalid lesson ID"),
});

export const createLessonContentSchema = z.object({
  lessonId: z.string().uuid("Invalid lesson ID"),
  type: z.enum(["VIDEO", "DOCUMENT", "QUIZ"], {
    message: "Invalid content type",
  }),
  status: z
    .enum(["DRAFT", "PROCESSING", "PUBLISHED"])
    .optional()
    .default("DRAFT"),
  data: z.record(z.any()).optional().default({}),
});
