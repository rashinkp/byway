export interface CourseReviewResponseDto {
  id: string;
  courseId: string;
  userId: string;
  rating: number;
  title: string | null;
  comment: string | null;
  createdAt: Date;
  updatedAt: Date;
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