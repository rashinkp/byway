import { z } from "zod";
import { AccessStatus } from "../../enum/access-status.enum";

// Quiz Answer Schema
export const QuizAnswerSchema = z.object({
  questionId: z.string(),
  selectedAnswer: z.string(),
  isCorrect: z.boolean(),
});

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

// Get Progress Schema
export const GetProgressSchema = z.object({
  userId: z.string(),
  courseId: z.string(),
});

// Quiz Answer DTO
export interface IQuizAnswerDTO {
  questionId: string;
  selectedAnswer: string;
  isCorrect: boolean;
}

// Update Progress DTO
export interface UpdateProgressDto {
  userId: string;
  courseId: string;
  lessonId: string;
  completed?: boolean;
  quizAnswers?: IQuizAnswerDTO[];
  score?: number;
  totalQuestions?: number;
}

// Get Progress DTO
export interface GetProgressDto {
  userId: string;
  courseId: string;
}

// Progress Output DTO
export interface IProgressOutputDTO {
  userId: string;
  courseId: string;
  lastLessonId: string;
  enrolledAt: Date;
  accessStatus: AccessStatus;
  completedLessons: number;
  totalLessons: number;
  lessonProgress: {
    lessonId: string;
    completed: boolean;
    completedAt?: Date;
    score?: number;
    totalQuestions?: number;
    answers?: {
      questionId: string;
      selectedAnswer: string;
      isCorrect: boolean;
    }[];
  }[];
} 