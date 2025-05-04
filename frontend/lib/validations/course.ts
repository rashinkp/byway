import { z } from "zod";

export const courseEditSchema = z
  .object({
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    level: z.enum(["BEGINNER", "MEDIUM", "ADVANCED"]),
    price: z.number().min(0, "Price cannot be negative").optional(),
    duration: z.number().min(1, "Duration must be at least 1 hour"),
    offer: z.number().min(0, "Offer price cannot be negative").optional(),
    status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"], {
      errorMap: () => ({ message: "Status is required" }),
    }),
    thumbnail: z.union([z.instanceof(File), z.string().url()]).optional(),
    categoryId: z.string().nonempty("Category is required"),
    prerequisites: z
      .string()
      .max(2000, "Prerequisites cannot exceed 2000 characters")
      .optional(),
    longDescription: z
      .string()
      .max(5000, "Detailed description cannot exceed 5000 characters")
      .optional(),
    objectives: z
      .string()
      .max(2000, "Objectives cannot exceed 2000 characters")
      .optional(),
    targetAudience: z
      .string()
      .max(2000, "Target audience cannot exceed 2000 characters")
      .optional(),
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
      if (data.offer !== undefined && data.price !== undefined) {
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
      .optional(),
    level: z
      .enum(["BEGINNER", "MEDIUM", "ADVANCED"])
      .refine((val) => val !== undefined, "Level is required"),
    price: z.number().min(0, "Price cannot be negative").optional(),
    thumbnail: z.union([z.instanceof(File), z.string().url()]).optional(),
    duration: z.number().min(0, "Duration cannot be negative"),
    offer: z.number().min(0, "Offer price cannot be negative").optional(),
    categoryId: z.string().nonempty("Category is required"),
    prerequisites: z
      .string()
      .max(2000, "Prerequisites cannot exceed 2000 characters")
      .optional(),
    longDescription: z
      .string()
      .max(5000, "Detailed description cannot exceed 5000 characters")
      .optional(),
    objectives: z
      .string()
      .max(2000, "Objectives cannot exceed 2000 characters")
      .optional(),
    targetAudience: z
      .string()
      .max(2000, "Target audience cannot exceed 2000 characters")
      .optional(),
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
      if (data.price !== undefined && data.offer !== undefined) {
        return data.offer <= data.price;
      }
      return true;
    },
    {
      message: "Offer price must be less than or equal to the regular price",
      path: ["offer"],
    }
  );
