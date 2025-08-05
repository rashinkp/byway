// ============================================================================
// SEARCH REQUEST DTOs
// ============================================================================

export interface SearchCoursesRequestDto {
  query: string;
  page?: number;
  limit?: number;
  categoryId?: string;
  level?: "BEGINNER" | "MEDIUM" | "ADVANCED" | "ALL";
  price?: "FREE" | "PAID" | "ALL";
  duration?: "UNDER_5" | "5_TO_10" | "OVER_10" | "ALL";
  rating?: number;
  sortBy?: "relevance" | "rating" | "price" | "newest" | "popular";
  sortOrder?: "asc" | "desc";
}

export interface SearchInstructorsRequestDto {
  query: string;
  page?: number;
  limit?: number;
  sortBy?: "relevance" | "rating" | "studentCount" | "courseCount";
  sortOrder?: "asc" | "desc";
}

export interface SearchLessonsRequestDto {
  query: string;
  courseId?: string;
  page?: number;
  limit?: number;
  sortBy?: "relevance" | "order" | "title";
  sortOrder?: "asc" | "desc";
}

export interface GlobalSearchRequestDto {
  query: string;
  page?: number;
  limit?: number;
  filters?: {
    type?: "courses" | "instructors" | "lessons" | "all";
    categoryId?: string;
    level?: "BEGINNER" | "MEDIUM" | "ADVANCED" | "ALL";
    price?: "FREE" | "PAID" | "ALL";
  };
}

// ============================================================================
// SEARCH RESPONSE DTOs
// ============================================================================

export interface SearchResultDto {
  id: string;
  title: string;
  description?: string;
  type: "course" | "instructor" | "lesson";
  relevance: number;
  metadata?: any;
}

export interface CourseSearchResultDto {
  id: string;
  title: string;
  description?: string;
  thumbnail?: string;
  price?: number;
  level: string;
  rating?: number;
  reviewCount?: number;
  instructor: {
    id: string;
    name: string;
    avatar?: string;
  };
  category: {
    id: string;
    name: string;
  };
  relevance: number;
}

export interface InstructorSearchResultDto {
  id: string;
  name: string;
  bio?: string;
  avatar?: string;
  expertise?: string;
  studentCount: number;
  courseCount: number;
  rating: number;
  relevance: number;
}

export interface LessonSearchResultDto {
  id: string;
  title: string;
  description?: string;
  thumbnail?: string;
  duration?: number;
  courseId: string;
  courseTitle: string;
  order: number;
  relevance: number;
}

export interface SearchResponseDto {
  results: SearchResultDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  query: string;
  filters?: any;
}

export interface CourseSearchResponseDto {
  courses: CourseSearchResultDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  query: string;
  filters?: any;
}

export interface InstructorSearchResponseDto {
  instructors: InstructorSearchResultDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  query: string;
}

export interface LessonSearchResponseDto {
  lessons: LessonSearchResultDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  query: string;
  filters?: any;
}

export interface GlobalSearchResponseDto {
  courses: CourseSearchResultDto[];
  instructors: InstructorSearchResultDto[];
  lessons: LessonSearchResultDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  query: string;
  filters?: any;
} 