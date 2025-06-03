export interface IQuizAnswer {
  questionId: string;
  selectedAnswer: string;
  isCorrect: boolean;
}

export interface ILessonProgress {
  lessonId: string;
  completed: boolean;
  completedAt?: Date;
  score?: number;
  totalQuestions?: number;
  answers?: IQuizAnswer[];
}

export interface IProgress {
  userId: string;
  courseId: string;
  lastLessonId: string;
  enrolledAt: Date;
  accessStatus: "ACTIVE" | "BLOCKED" | "EXPIRED";
  completedLessons: number;
  totalLessons: number;
  lessonProgress: ILessonProgress[];
}

export interface IUpdateProgressInput {
  courseId: string;
  lessonId: string;
  completed?: boolean;
  quizAnswers?: IQuizAnswer[];
  score?: number;
  totalQuestions?: number;
}

export interface IGetProgressInput {
  courseId: string;
}

export interface IProgressResponse {
  success: boolean;
  data: IProgress;
  message: string;
  statusCode: number;
} 