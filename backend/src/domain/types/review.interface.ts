export interface ICourseReviewWithUser {
  id: string;
  courseId: string;
  userId: string;
  rating: number;
  title: string | null;
  comment: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
  user?: {
    id: string;
    name: string;
    avatar: string | null;
  };
}

export interface ICourseReviewSummary {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    [key: number]: number; // e.g. 1-5 stars mapped to counts
  };
  recentReviews: ICourseReviewWithUser[];
}

export interface ICourseReviewQuery {
  courseId: string;
  page?: number;
  limit?: number;
  rating?: number;
  sortBy?: "rating" | "createdAt";
  sortOrder?: "asc" | "desc";
  isMyReviews?: boolean;
  includeDisabled?: boolean;
}

export interface ICourseReviewPaginatedResult {
  reviews: ICourseReviewWithUser[];
  total: number;
  totalPages: number;
}
