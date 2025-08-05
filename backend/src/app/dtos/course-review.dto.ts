// ============================================================================
// COURSE REVIEW REQUEST DTOs
// ============================================================================

export interface CreateCourseReviewRequestDto {
  courseId: string;
  userId: string;
  rating: number;
  title?: string;
  comment?: string;
}

export interface UpdateCourseReviewRequestDto {
  reviewId: string;
  rating?: number;
  title?: string;
  comment?: string;
}

export interface GetCourseReviewsRequestDto {
  courseId: string;
  page?: number;
  limit?: number;
  sortBy?: "rating" | "createdAt" | "helpful";
  sortOrder?: "asc" | "desc";
  rating?: number;
}

export interface GetUserReviewsRequestDto {
  userId: string;
  page?: number;
  limit?: number;
}

export interface DeleteCourseReviewRequestDto {
  reviewId: string;
  userId: string;
}

export interface MarkReviewHelpfulRequestDto {
  reviewId: string;
  userId: string;
  helpful: boolean;
}

// ============================================================================
// COURSE REVIEW RESPONSE DTOs
// ============================================================================

export interface CourseReviewResponseDto {
  id: string;
  courseId: string;
  userId: string;
  rating: number;
  title?: string;
  comment?: string;
  helpfulCount: number;
  isHelpful?: boolean;
  createdAt: Date;
  updatedAt: Date;
  user: {
    id: string;
    name: string;
    avatar?: string;
  };
  course: {
    id: string;
    title: string;
    thumbnail?: string;
  };
}

export interface CourseReviewsListResponseDto {
  reviews: CourseReviewResponseDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  averageRating: number;
  ratingDistribution: {
    [key: number]: number;
  };
}

export interface CourseReviewStatsResponseDto {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    [key: number]: number;
  };
  ratingPercentages: {
    [key: number]: number;
  };
}

export interface UserReviewResponseDto {
  id: string;
  courseId: string;
  rating: number;
  title?: string;
  comment?: string;
  helpfulCount: number;
  createdAt: Date;
  updatedAt: Date;
  course: {
    id: string;
    title: string;
    thumbnail?: string;
  };
} 