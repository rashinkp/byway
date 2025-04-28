import { z } from "zod";
import { ContentType, ContentStatus } from "@/types/content";

export const quizQuestionSchema = z.object({
  question: z.string().min(1, "Question is required"),
  options: z
    .array(z.string().min(1, "Option cannot be empty"))
    .min(2, "At least two options are required")
    .max(4, "Maximum of four options allowed"),
  correctAnswer: z.string().min(1, "Correct answer is required"),
});

const baseContentSchema = z.object({
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
    .default(ContentStatus.DRAFT),
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
        if (!val) return true;
        return (
          val.startsWith("https://res.cloudinary.com") || val.startsWith("http")
        );
      },
      { message: "Invalid file URL" }
    ),
  thumbnailUrl: z
    .string()
    .url("Invalid URL")
    .optional()
    .refine(
      (val) => {
        if (!val) return true;
        return (
          val.startsWith("https://res.cloudinary.com") || val.startsWith("http")
        );
      },
      { message: "Invalid thumbnail URL" }
    ),
  quizQuestions: z.array(quizQuestionSchema).optional(),
});

export const createContentSchema = baseContentSchema
  .refine(
    (data) => {
      if (data.type === ContentType.QUIZ) {
        return (
          data.quizQuestions &&
          data.quizQuestions.length > 0 &&
          !data.fileUrl &&
          !data.thumbnailUrl
        );
      }
      return !!data.fileUrl && !data.quizQuestions?.length;
    },
    {
      message:
        "For VIDEO or DOCUMENT, fileUrl is required and quizQuestions must be empty. For QUIZ, quizQuestions are required and fileUrl/thumbnailUrl must be empty.",
      path: ["fileUrl", "quizQuestions"],
    }
  )
  .refine(
    (data) => {
      if (data.type === ContentType.VIDEO) {
        return !!data.thumbnailUrl;
      }
      return !data.thumbnailUrl;
    },
    {
      message:
        "Thumbnail URL is required for VIDEO and not allowed for other types.",
      path: ["thumbnailUrl"],
    }
  );

export const updateContentSchema = baseContentSchema
  .partial()
  .extend({
    id: z.string().uuid("Invalid content ID"),
  });

export const getContentSchema = z.object({
  lessonId: z.string().uuid("Invalid lesson ID"),
});

export const deleteContentSchema = z.object({
  id: z.string().uuid("Invalid content ID"),
});
