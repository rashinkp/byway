export interface CreateCourseReviewDto {
  courseId: string;
  rating: number;
  title?: string;
  comment?: string;
} 