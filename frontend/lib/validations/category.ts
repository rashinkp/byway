import z from "zod";

export const categoryFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Name must be at least 3 characters")
    .max(100, "Name must be less than 100 characters")
    .regex(/^[a-zA-Z0-9\s\-\&]+$/, "Name can only contain letters, numbers, spaces, hyphens, and ampersands"),
  description: z
    .string()
    .trim()
    .max(300, "Description must be less than 300 characters")
    .optional()
});
