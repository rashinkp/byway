import { z } from "zod";

export const createLessonContentSchema = z.object({
  lessonId: z.string().uuid("Invalid lesson ID"),
  type: z.enum(["VIDEO", "DOCUMENT", "QUIZ"], {
    message: "Invalid content type",
  }),
  status: z
    .enum(["DRAFT", "PROCESSING", "PUBLISHED", "ERROR"])
    .optional()
    .default("PUBLISHED"),
  data: z
    .object({
      title: z
        .string()
        .min(1, "Title is required")
        .max(100, "Title must be at most 100 characters"),
      description: z
        .string()
        .max(500, "Description must be at most 500 characters")
        .optional()
        .nullable(),
      fileUrl: z
        .string()
        .url("Invalid URL")
        .optional()
        .refine(
          (val) => {
            if (val === undefined) return true;
            return (
              val.startsWith("https://res.cloudinary.com") ||
              val.startsWith("http")
            );
          },
          { message: "Invalid file URL" }
        ),
      questions: z
        .array(
          z.object({
            question: z.string().min(1, "Question is required"),
            options: z
              .array(z.string())
              .min(2, "At least two options required"),
            answer: z.string().min(1, "Answer is required"),
          })
        )
        .optional(),
    })
    .refine(
      (data) => {
        if (["VIDEO", "DOCUMENT"].includes(data.type)) {
          return !!data.fileUrl;
        }
        if (data.type === "QUIZ") {
          return !!data.questions && data.questions.length > 0;
        }
        return true;
      },
      { message: "fileUrl is required for VIDEO/DOCUMENT, questions for QUIZ" }
    ),
});

export const updateLessonContentSchema = createLessonContentSchema
  .partial()
  .extend({
    id: z.string().uuid("Invalid content ID"),
  });

export const getLessonContentSchema = z.object({
  lessonId: z.string().uuid("Invalid lesson ID"),
});

export const deleteLessonContentSchema = z.object({
  id: z.string().uuid("Invalid content ID"),
});
