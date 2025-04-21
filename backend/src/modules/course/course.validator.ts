import { z } from "zod";

export const createCourseSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title must be at most 100 characters"),
  description: z
    .string()
    .max(500, "Description must be at most 500 characters")
    .optional()
    .nullable(),
  level: z
    .enum(["BEGINNER", "MEDIUM", "ADVANCED"])
    .optional()
    .default("BEGINNER"),
  price: z
    .number()
    .nonnegative("Price must be non-negative")
    .optional()
    .nullable(),
  thumbnail: z.string().url("Invalid URL").optional().nullable(),
  duration: z
    .number()
    .positive("Duration must be positive")
    .optional()
    .nullable(),
  offer: z
    .number()
    .min(0, "Offer must be non-negative")
    .max(100, "Offer must be at most 100")
    .optional()
    .nullable(),
  status: z
    .enum(["DRAFT", "PUBLISHED", "ARCHIVED"])
    .optional()
    .default("DRAFT"),
  categoryId: z.string().uuid("Invalid category ID"),
  createdBy: z.string().uuid("Invalid user ID"),
  details: z
    .object({
      prerequisites: z
        .string()
        .max(1000, "Prerequisites must be at most 1000 characters")
        .optional()
        .nullable(),
      longDescription: z
        .string()
        .max(2000, "Long description must be at most 2000 characters")
        .optional()
        .nullable(),
      objectives: z
        .string()
        .max(1000, "Objectives must be at most 1000 characters")
        .optional()
        .nullable(),
      targetAudience: z
        .string()
        .max(1000, "Target audience must be at most 1000 characters")
        .optional()
        .nullable(),
    })
    .optional()
    .nullable(),
});

export const updateCourseSchema = z.object({
  id: z.string().uuid("Invalid course ID"),
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title must be at most 100 characters")
    .optional(),
  description: z
    .string()
    .max(500, "Description must be at most 500 characters")
    .optional()
    .nullable(),
  level: z.enum(["BEGINNER", "MEDIUM", "ADVANCED"]).optional(),
  price: z
    .number()
    .nonnegative("Price must be non-negative")
    .optional()
    .nullable(),
  thumbnail: z.string().url("Invalid URL").optional().nullable(),
  duration: z
    .number()
    .positive("Duration must be positive")
    .optional()
    .nullable(),
  offer: z
    .number()
    .min(0, "Offer must be non-negative")
    .max(100, "Offer must be at most 100")
    .optional()
    .nullable(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).optional(),
  categoryId: z.string().uuid("Invalid category ID").optional(),
  createdBy: z.string().uuid("Invalid user ID"),
  details: z
    .object({
      prerequisites: z
        .string()
        .max(1000, "Prerequisites must be at most 1000 characters")
        .optional()
        .nullable(),
      longDescription: z
        .string()
        .max(2000, "Long description must be at most 2000 characters")
        .optional()
        .nullable(),
      objectives: z
        .string()
        .max(1000, "Objectives must be at most 1000 characters")
        .optional()
        .nullable(),
      targetAudience: z
        .string()
        .max(1000, "Target audience must be at most 1000 characters")
        .optional()
        .nullable(),
    })
    .optional()
    .nullable(),
});

export const getAllCoursesSchema = z.object({
  page: z.number().int().positive().optional().default(1),
  limit: z.number().int().positive().optional().default(10),
  sortBy: z
    .enum(["name", "createdAt", "updatedAt"])
    .optional()
    .default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
  includeDeleted: z.boolean().optional().default(false),
  search: z.string().optional().default(""),
  filterBy: z.enum(["All", "Active", "Draft"]).optional().default("All"),
  userId: z.string().uuid("Invalid user ID"),
});


export const createEnrollmentSchema = z.object({
  userId: z.string().uuid("Invalid user ID"),
  courseId: z.string().uuid("Invalid course ID"),
});

export const courseIdSchema = z.object({
  id: z.string().uuid("Invalid course ID"),
});
