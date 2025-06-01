export interface IProgress {
  userId: string;
  courseId: string;
  progress: number;
  lastLessonId?: string;
  completedAt?: string;
  accessStatus: 'ACTIVE' | 'BLOCKED' | 'EXPIRED';
}

export interface IUpdateProgressInput {
  courseId: string;
  progress: number;
  lastLessonId?: string;
}

export interface IGetProgressInput {
  courseId: string;
}

export interface IProgressResponse {
  success: boolean;
  message: string;
  data: IProgress;
  statusCode: number;
} 