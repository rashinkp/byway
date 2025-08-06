import { RatingLevel } from "@/domain/enum/rating-level.enum";

export interface CourseReviewResponseDto {
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

export interface CourseReviewSummaryDto {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    [key: number]: number;
  };
  recentReviews: CourseReviewResponseDto[];
}

export class CourseReviewStatsDto {
  courseId!: string;
  averageRating!: number;
  totalReviews!: number;
  ratingDistribution!: {
    [key in RatingLevel]: number;
  };
  ratingPercentages!: {
    [key in RatingLevel]: number;
  };
  recentActivity!: {
    lastReviewDate: Date | null;
    reviewsThisMonth: number;
    reviewsThisWeek: number;
  };
  qualityMetrics!: {
    averageCommentLength: number;
    reviewsWithComments: number;
    reviewsWithTitles: number;
  };
}

export class ReviewAnalyticsDto {
  totalReviews!: number;
  averageRating!: number;
  ratingBreakdown!: {
    excellent: number;
    good: number;
    average: number;
    poor: number;
    veryPoor: number;
  };
  trendData!: {
    period: string;
    newReviews: number;
    averageRating: number;
  }[];
}


export interface CreateCourseReviewDto {
  courseId: string;
  rating: number;
  title?: string;
  comment?: string;
} 


export interface QueryCourseReviewDto {
  courseId: string;
  page?: number;
  limit?: number;
  rating?: number;
  sortBy?: "rating" | "createdAt";
  sortOrder?: "asc" | "desc";
  isMyReviews?: boolean;
  includeDisabled?: boolean;
} 


export interface UpdateCourseReviewDto {
  rating?: number;
  title?: string;
  comment?: string;
} 