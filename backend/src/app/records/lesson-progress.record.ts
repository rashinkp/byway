export interface LessonProgressRecord {
  id: string;
  enrollmentId: string;
  courseId: string;
  lessonId: string;
  completed: boolean;
  completedAt?: Date | null;
  score?: number | null;
  totalQuestions?: number | null;
  createdAt: Date;
  updatedAt: Date;
} 