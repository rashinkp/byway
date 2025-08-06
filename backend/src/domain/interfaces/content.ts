import { ContentStatus, ContentType } from "../enum/content.enum";
import { FileUrl } from "../value-object/file-url";

export interface QuizQuestion {
  id: string;
  questionText: string;
  questionType: "MULTIPLE_CHOICE" | "TRUE_FALSE" | "SHORT_ANSWER";
  options?: string[] | null; // For multiple-choice or true/false questions
  correctAnswer: string | string[] | boolean; // Supports single answer, multiple answers, or true/false
  explanation?: string | null; // Optional explanation for the correct answer
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null; // For soft delete support
}


export interface LessonContentProps {
  id: string;
  lessonId: string;
  type: ContentType;
  status: ContentStatus;
  title?: string | null;
  description?: string | null;
  fileUrl?: FileUrl | null;
  thumbnailUrl?: FileUrl | null;
  quizQuestions?: QuizQuestion[] | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}
