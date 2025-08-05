// ============================================================================
// LESSON REQUEST DTOs
// ============================================================================

export interface GetAllLessonsRequestDto {
  courseId: string;
  page?: number;
  limit?: number;
  sortBy?: "order" | "title" | "createdAt" | "updatedAt";
  sortOrder?: "asc" | "desc";
  search?: string;
  filterBy?: "DRAFT" | "PUBLISHED" | "ALL" | "INACTIVE";
  includeDeleted?: boolean;
}

export interface GetPublicLessonsRequestDto {
  courseId: string;
  page?: number;
  limit?: number;
  sortBy?: "order" | "title" | "createdAt" | "updatedAt";
  sortOrder?: "asc" | "desc";
  search?: string;
}

export interface GetLessonByIdRequestDto {
  lessonId: string;
  userId?: string;
}

export interface CreateLessonRequestDto {
  courseId: string;
  title: string;
  description?: string;
  order: number;
  status?: "DRAFT" | "PUBLISHED";
  content?: CreateLessonContentRequestDto;
  thumbnail?: string;
  duration?: number;
}

export interface UpdateLessonRequestDto {
  lessonId: string;
  title?: string;
  description?: string;
  order?: number;
  status?: "DRAFT" | "PUBLISHED";
  content?: UpdateLessonContentRequestDto;
  thumbnail?: string;
  duration?: number;
}

export interface DeleteLessonRequestDto {
  lessonId: string;
}

// ============================================================================
// LESSON CONTENT REQUEST DTOs
// ============================================================================

export interface CreateLessonContentRequestDto {
  lessonId: string;
  type: "VIDEO" | "DOCUMENT" | "QUIZ" | "ASSIGNMENT";
  status?: "DRAFT" | "PUBLISHED";
  title?: string;
  description?: string;
  fileUrl?: string;
  thumbnailUrl?: string;
  quizQuestions?: QuizQuestionDto[];
}

export interface UpdateLessonContentRequestDto {
  id: string;
  type?: "VIDEO" | "DOCUMENT" | "QUIZ" | "ASSIGNMENT";
  status?: "DRAFT" | "PUBLISHED";
  title?: string;
  description?: string;
  fileUrl?: string;
  thumbnailUrl?: string;
  quizQuestions?: QuizQuestionDto[];
}

export interface QuizQuestionDto {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

// ============================================================================
// LESSON RESPONSE DTOs
// ============================================================================

export interface LessonContentResponseDto {
  id: string;
  lessonId: string;
  type: string;
  status: string;
  title?: string;
  description?: string;
  fileUrl?: string;
  thumbnailUrl?: string;
  quizQuestions?: QuizQuestionDto[];
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

export interface LessonResponseDto {
  id: string;
  courseId: string;
  title: string;
  description?: string;
  order: number;
  status: string;
  content?: LessonContentResponseDto;
  thumbnail?: string;
  duration?: number;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

export interface PublicLessonResponseDto {
  id: string;
  title: string;
  description?: string;
  order: number;
  thumbnail?: string;
  duration?: number;
}

export interface LessonListResponseDto {
  lessons: LessonResponseDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PublicLessonListResponseDto {
  lessons: PublicLessonResponseDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
} 