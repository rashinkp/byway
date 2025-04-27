import { z } from "zod";
import { ContentType, ContentStatus } from "@/types/content";

export const createContentSchema = z.object({
  lessonId: z.string().uuid("Invalid lesson ID"),
  type: z.enum([ContentType.VIDEO, ContentType.DOCUMENT, ContentType.QUIZ], {
    message: "Invalid content type",
  }),
  status: z
    .enum([
      ContentStatus.DRAFT,
      ContentStatus.PROCESSING,
      ContentStatus.PUBLISHED,
      ContentStatus.ERROR,
    ])
    .optional()
    .default(ContentStatus.PUBLISHED),
  data: z
    .object({
      type: z.enum([ContentType.VIDEO, ContentType.DOCUMENT, ContentType.QUIZ], {
        message: "Invalid content type",
      }),
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
        if ([ContentType.VIDEO, ContentType.DOCUMENT].includes(data.type)) {
          return !!data.fileUrl;
        }
        if (data.type === ContentType.QUIZ) {
          return !!data.questions && data.questions.length > 0;
        }
        return true;
      },
      { message: "fileUrl is required for VIDEO/DOCUMENT, questions for QUIZ" }
    ),
});

export const updateContentSchema = createContentSchema.partial().extend({
  id: z.string().uuid("Invalid content ID"),
});

export const getContentSchema = z.object({
  lessonId: z.string().uuid("Invalid lesson ID"),
});

export const deleteContentSchema = z.object({
  id: z.string().uuid("Invalid content ID"),
});
