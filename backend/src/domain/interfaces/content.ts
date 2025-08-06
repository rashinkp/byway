
import { ContentStatus, ContentType } from "../enum/content.enum";
import { FileUrl } from "../value-object/file-url";

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

export interface QuizQuestion {
  id: string;
  lessonContentId: string;
  question: string;
  options: string[];
  correctAnswer: string;
  createdAt: Date;
  updatedAt: Date;
}
