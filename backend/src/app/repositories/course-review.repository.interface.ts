import { CourseReviewRecord } from "../records/course-review.record";

export interface ICourseReviewRepository {
  // Basic CRUD operations
  save(review: CourseReviewRecord): Promise<CourseReviewRecord>;
  findById(id: string): Promise<CourseReviewRecord | null>;
  update(review: CourseReviewRecord): Promise<CourseReviewRecord>;
  softDelete(review: CourseReviewRecord): Promise<CourseReviewRecord>;
  restore(review: CourseReviewRecord): Promise<CourseReviewRecord>;
  delete(id: string): Promise<void>;

  // Query operations
  findByCourseId(options: {
    courseId: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    rating?: number;
    userId?: string;
  }): Promise<{ reviews: CourseReviewRecord[]; total: number; totalPages: number }>;

  findByUserId(options: {
    userId: string;
    page?: number;
    limit?: number;
  }): Promise<{ reviews: CourseReviewRecord[]; total: number; totalPages: number }>;

  findByUserAndCourse(userId: string, courseId: string): Promise<CourseReviewRecord | null>;

  // Statistics
  getCourseReviewStats(courseId: string): Promise<{
    averageRating: number;
    totalReviews: number;
    ratingDistribution: Record<string, number>;
  }>;
}
