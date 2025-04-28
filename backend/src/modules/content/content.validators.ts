import { z } from "zod";

// Zod Schemas
export const quizQuestionSchema = z.object({
  question: z.string().min(1, "Question is required"),
  options: z
    .array(z.string().min(1, "Option cannot be empty"))
    .min(2, "At least two options are required")
    .max(4, "Maximum of four options allowed"),
  correctAnswer: z.string().min(1, "Correct answer is required"),
});

const baseLessonContentSchema = z.object({
  lessonId: z.string().uuid("Invalid lesson ID"),
  type: z.enum(["VIDEO", "DOCUMENT", "QUIZ"], {
    message: "Invalid content type",
  }),
  status: z
    .enum(["DRAFT", "PROCESSING", "PUBLISHED", "ERROR"])
    .optional()
    .default("DRAFT"),
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

export const createLessonContentSchema = baseLessonContentSchema
  .refine(
    (data) => {
      if (data.type === "QUIZ") {
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
      if (data.type === "VIDEO") {
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

export const updateLessonContentSchema = baseLessonContentSchema
  .extend({
    id: z.string().uuid("Invalid content ID"),
  });

export const getLessonContentSchema = z.object({
  lessonId: z.string().uuid("Invalid lesson ID"),
});

export const deleteLessonContentSchema = z.object({
  id: z.string().uuid("Invalid content ID"),
});
