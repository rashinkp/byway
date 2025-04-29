import { z } from "zod";

export const courseEditSchema = z
  .object({
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    level: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]),
    price: z.number().min(0, "Price cannot be negative"),
    duration: z.number().min(1, "Duration must be at least 1 minute"),
    offer: z.number().min(0, "Offer price cannot be negative").optional(),
    status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"], {
      errorMap: () => ({ message: "Status is required" }),
    }),
  })
  .refine(
    (data) => {
      if (data.offer !== undefined) {
        return data.offer <= data.price;
      }
      return true;
    },
    {
      message: "Offer price must be less than or equal to actual price",
      path: ["offer"],
    }
  );


export const courseSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title is too long"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(1000, "Description is too long"),
  categoryId: z.string().min(1, "Category is required"),
  price: z
    .number()
    .min(0, "Price must be a positive number")
    .max(9999.99, "Price is too high"),
  duration: z.number().min(1, "Duration must be at least 1 minute"),
  level: z.enum(["BEGINNER", "MEDIUM", "ADVANCED"], {
    errorMap: () => ({ message: "Level is required" }),
  }),
  thumbnail: z
    .string()
    .url("Invalid URL format")
    .min(1, "Thumbnail URL is required")
    .max(200, "Thumbnail URL is too long"),
});