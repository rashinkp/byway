import { RatingLevel } from "../../enum/rating-level.enum";

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