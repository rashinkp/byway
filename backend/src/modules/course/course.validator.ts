import { z } from "zod";
export const createCourseSchema = z
  .object({
    title: z
      .string()
      .min(3, "Title must be at least 3 characters")
      .max(100, "Title cannot exceed 100 characters")
      .nonempty("Title is required"),
    description: z
      .string()
      .max(1000, "Description cannot exceed 1000 characters")
      .optional()
      .nullable(),
    level: z
      .enum(["BEGINNER", "MEDIUM", "ADVANCED"])
      .refine((val) => val !== undefined, "Level is required"),
    price: z.number().min(0, "Price cannot be negative").optional().nullable(),
    thumbnail: z
      .string()
      .url("Thumbnail must be a valid URL")
      .optional()
      .nullable(),
    duration: z
      .number()
      .min(0, "Duration cannot be negative")
      .optional()
      .nullable(),
    offer: z
      .number()
      .min(0, "Offer price cannot be negative")
      .optional()
      .nullable(),
    status: z
      .enum(["DRAFT", "PUBLISHED", "ARCHIVED"])
      .refine((val) => val !== undefined, "Status is required"),
    categoryId: z.string().uuid("Category ID must be a valid UUID"),
    createdBy: z.string().uuid("Created by must be a valid user ID"),
        prerequisites: z
          .string()
          .max(2000, "Prerequisites cannot exceed 2000 characters")
          .optional()
          .nullable(),
        longDescription: z
          .string()
          .max(5000, "Long description cannot exceed 5000 characters")
          .optional()
          .nullable(),
        objectives: z
          .string()
          .max(2000, "Objectives cannot exceed 2000 characters")
          .optional()
          .nullable(),
        targetAudience: z
          .string()
          .max(2000, "Target audience cannot exceed 2000 characters")
          .optional()
          .nullable(),
  })
  .refine(
    (data) => {
      if (data.price !== undefined && data.price !== null && data.offer !== undefined && data.offer !== null) {
        return data.offer <= data.price;
      }
      return true;
    },
    {
      message: "Offer price must be less than or equal to the regular price",
      path: ["offer"],
    }
  );

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
    .enum(["title", "createdAt", "updatedAt"])
    .optional()
    .default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
  includeDeleted: z.boolean().optional().default(false),
  search: z.string().optional().default(""),
  filterBy: z.enum(["All", "Active", "Draft" , "Inactive"]).optional().default("All"),
  userId: z.string().uuid("Invalid user ID").optional(),
});


export const createEnrollmentSchema = z.object({
  userId: z.string().uuid("Invalid user ID"),
  courseId: z.string().uuid("Invalid course ID"),
});

export const courseIdSchema = z.object({
  courseId: z.string().uuid("Invalid course ID"),
});
