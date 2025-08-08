import { z } from "zod";

// Quiz Answer Schema
export const QuizAnswerSchema = z.object({
  questionId: z.string(),
  selectedAnswer: z.string(),
  isCorrect: z.boolean(),
});

export type IQuizAnswerDTO = z.infer<typeof QuizAnswerSchema>;

// Update Progress Schema
export const UpdateProgressSchema = z.object({
  userId: z.string(),
  courseId: z.string(),
  lessonId: z.string(),
  completed: z.boolean().optional(),
  quizAnswers: z.array(QuizAnswerSchema).optional(),
  score: z.number().optional(),
  totalQuestions: z.number().optional(),
});

export type UpdateProgressDto = z.infer<typeof UpdateProgressSchema>;

export function validateUpdateProgress(data: unknown): UpdateProgressDto {
  return UpdateProgressSchema.parse(data);
}

// Get Progress Schema
export const GetProgressSchema = z.object({
  userId: z.string(),
  courseId: z.string(),
});

export type GetProgressDto = z.infer<typeof GetProgressSchema>;

export function validateGetProgress(data: unknown): GetProgressDto {
  return GetProgressSchema.parse(data);
}
