// src/utils/validate.ts
import { z } from "zod";


export const lessonSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title is too long"),
  description: z
    .string()
    .max(1000, "Description is too long")
    .optional()
    .or(z.literal("")),
  order: z.number().int().positive("Order must be positive"),
  courseId: z.string().optional(),
  status: z.enum(["DRAFT", "PUBLISHED"]).optional(),
});

export type LessonFormData = z.infer<typeof lessonSchema>;


export function validateLessonData(data: LessonFormData): LessonFormData {
  return lessonSchema.parse(data);
}


