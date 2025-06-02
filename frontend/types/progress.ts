export interface ILessonProgress {
  lessonId: string;
  completed: boolean;
  completedAt?: Date;
}

export interface IProgress {
  userId: string;
  courseId: string;
  progress: number;
  lastLessonId?: string;
  completedAt?: Date;
  enrolledAt: Date;
  accessStatus: 'ACTIVE' | 'BLOCKED' | 'EXPIRED';
  completedLessons: number;
  totalLessons: number;
  lessonProgress: ILessonProgress[];
}

export interface IUpdateProgressInput {
  courseId: string;
  lessonId: string;
  completed?: boolean;
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