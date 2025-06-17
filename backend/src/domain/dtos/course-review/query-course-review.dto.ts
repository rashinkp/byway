export interface QueryCourseReviewDto {
  courseId: string;
  page?: number;
  limit?: number;
  rating?: number;
  sortBy?: 'rating' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
  isMyReviews?: boolean;
  includeDisabled?: boolean;
} 