import { AccessStatus } from "../../domain/enum/access-status.enum";

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
