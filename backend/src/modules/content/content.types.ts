import { z } from "zod";
import { ContentStatus, ContentType } from "@prisma/client";
import {
  createLessonContentSchema,
  deleteLessonContentSchema,
  getLessonContentSchema,
  updateLessonContentSchema,
} from "./content.validators";

// Infer types from schemas
export type CreateLessonContentInput = z.infer<
  typeof createLessonContentSchema
>;
export type UpdateLessonContentInput = z.infer<
  typeof updateLessonContentSchema
>;
export type GetLessonContentInput = z.infer<typeof getLessonContentSchema>;
export type DeleteLessonContentInput = z.infer<
  typeof deleteLessonContentSchema
>;

// TypeScript Interfaces
export interface IQuizQuestion {
  id: string;
  lessonContentId: string;
  question: string;
  options: string[];
  correctAnswer: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateLessonContentInput {
  lessonId: string;
  type: ContentType;
  status?: ContentStatus;
  title: string;
  description?: string | null;
  fileUrl?: string;
  thumbnailUrl?: string;
  quizQuestions?: {
    question: string;
    options: string[];
    correctAnswer: string;
  }[];
}

export interface IUpdateLessonContentInput {
  id: string;
  lessonId: string;
  type?: ContentType;
  status?: ContentStatus;
  title?: string;
  description?: string | null;
  fileUrl?: string;
  thumbnailUrl?: string;
  quizQuestions?: {
    question: string;
    options: string[];
    correctAnswer: string;
  }[];
}

export interface ILessonContent {
  id: string;
  lessonId: string;
  type: ContentType;
  status: ContentStatus;
  title: string | null;
  description: string | null;
  fileUrl: string | null;
  thumbnailUrl: string | null;
  quizQuestions: IQuizQuestion[];
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}

