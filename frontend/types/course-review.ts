export interface CourseReview {
  id: string;
  courseId: string;
  userId: string;
  rating: number;
  title?: string | null;
  comment?: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
  user?: {
    id: string;
    name: string;
    avatar?: string | null;
  };
}

export interface CreateCourseReviewParams {
  courseId: string;
  rating: number;
  title?: string;
  comment?: string;
}

export interface UpdateCourseReviewParams {
  rating?: number;
  title?: string;
  comment?: string;
}

export interface CourseReviewApiResponse {
  reviews: CourseReview[];
  total: number;
  totalPages: number;
}

export interface CourseReviewStats {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    [key: number]: number;
  };
}

export interface DisableReviewResponse {
  action: 'disabled' | 'enabled';
}

export interface QueryCourseReviewParams {
  page?: number;
  limit?: number;
  rating?: number;
  sortBy?: 'rating' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
  isMyReviews?: boolean;
  includeDisabled?: boolean;
}

export interface GetUserReviewsParams {
  page?: number;
  limit?: number;
}

export interface GetUserReviewsResponse {
  reviews: CourseReview[];
  total: number;
  totalPages: number;
} 