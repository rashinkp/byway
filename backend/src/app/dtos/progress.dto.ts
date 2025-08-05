// ============================================================================
// PROGRESS REQUEST DTOs
// ============================================================================

export interface GetCourseProgressRequestDto {
  userId: string;
  courseId: string;
}

export interface GetUserProgressRequestDto {
  userId: string;
  page?: number;
  limit?: number;
}

export interface UpdateLessonProgressRequestDto {
  userId: string;
  lessonId: string;
  completed: boolean;
  score?: number;
  answers?: QuizAnswerDto[];
}

export interface GetLessonProgressRequestDto {
  userId: string;
  lessonId: string;
}

export interface MarkLessonCompletedRequestDto {
  userId: string;
  lessonId: string;
}

export interface QuizAnswerDto {
  questionId: string;
  selectedAnswer: string;
  isCorrect: boolean;
}

// ============================================================================
// PROGRESS RESPONSE DTOs
// ============================================================================

export interface CourseProgressResponseDto {
  courseId: string;
  userId: string;
  totalLessons: number;
  completedLessons: number;
  progressPercentage: number;
  lastAccessedAt?: Date;
  enrolledAt: Date;
  completedAt?: Date;
  course: {
    id: string;
    title: string;
    thumbnail?: string;
    duration?: number;
  };
  lessons: LessonProgressResponseDto[];
}

export interface LessonProgressResponseDto {
  lessonId: string;
  title: string;
  order: number;
  completed: boolean;
  completedAt?: Date;
  score?: number;
  totalQuestions?: number;
  duration?: number;
  thumbnail?: string;
}

export interface UserProgressResponseDto {
  userId: string;
  totalEnrolledCourses: number;
  completedCourses: number;
  inProgressCourses: number;
  totalLessonsCompleted: number;
  averageProgress: number;
  courses: CourseProgressResponseDto[];
}

export interface ProgressSummaryResponseDto {
  totalCourses: number;
  completedCourses: number;
  inProgressCourses: number;
  totalLessons: number;
  completedLessons: number;
  averageProgress: number;
  certificatesEarned: number;
}

export interface QuizProgressResponseDto {
  lessonId: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  passed: boolean;
  answers: QuizAnswerResponseDto[];
  completedAt: Date;
}

export interface QuizAnswerResponseDto {
  questionId: string;
  question: string;
  selectedAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  explanation?: string;
} 