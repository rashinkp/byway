import { z } from "zod";

export const courseEditSchema = z
  .object({
    title: z.string().min(1, "Title is required"),
    description: z.string().optional().nullable(),
    level: z.enum(["BEGINNER", "MEDIUM", "ADVANCED"]),
    price: z.number().min(0, "Price cannot be negative").optional().nullable(),
    duration: z
      .number()
      .min(0, "Duration cannot be negative")
      .optional()
      .nullable(), // Allow duration to be optional and nullable
    offer: z
      .number()
      .min(0, "Offer price cannot be negative")
      .optional()
      .nullable(),
    status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"], {
      errorMap: () => ({ message: "Status is required" }),
    }),
    thumbnail: z
      .union([z.instanceof(File), z.string().url()])
      .optional()
      .nullable(),
    categoryId: z.string().nonempty("Category is required"),
    prerequisites: z
      .string()
      .max(2000, "Prerequisites cannot exceed 2000 characters")
      .optional()
      .nullable(),
    longDescription: z
      .string()
      .max(5000, "Detailed description cannot exceed 5000 characters")
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
      if (data.thumbnail instanceof File) {
        return data.thumbnail.size <= 5 * 1024 * 1024; // 5MB
      }
      return true;
    },
    {
      message: "Thumbnail must be an image file under 5MB",
      path: ["thumbnail"],
    }
  )
  .refine(
    (data) => {
      if (
        data.offer !== undefined &&
        data.offer !== null &&
        data.price !== undefined &&
        data.price !== null
      ) {
        return data.offer <= data.price;
      }
      return true;
    },
    {
      message: "Offer price must be less than or equal to actual price",
      path: ["offer"],
    }
  );

export const courseSchema = z
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
      .union([z.instanceof(File), z.string().url()])
      .optional()
      .nullable(),
    duration: z
      .number()
      .min(0, "Duration cannot be negative")
      .optional()
      .nullable(), // Allow duration to be optional and nullable
    offer: z
      .number()
      .min(0, "Offer price cannot be negative")
      .optional()
      .nullable(),
    categoryId: z.string().nonempty("Category is required"),
    prerequisites: z
      .string()
      .max(2000, "Prerequisites cannot exceed 2000 characters")
      .optional()
      .nullable(),
    longDescription: z
      .string()
      .max(5000, "Detailed description cannot exceed 5000 characters")
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
      if (data.thumbnail instanceof File) {
        return data.thumbnail.size <= 5 * 1024 * 1024; // 5MB
      }
      return true;
    },
    {
      message: "Thumbnail must be an image file under 5MB",
      path: ["thumbnail"],
    }
  )
  .refine(
    (data) => {
      if (
        data.price !== undefined &&
        data.price !== null &&
        data.offer !== undefined &&
        data.offer !== null
      ) {
        return data.offer <= data.price;
      }
      return true;
    },
    {
      message: "Offer price must be less than or equal to the regular price",
      path: ["offer"],
    }
  );
