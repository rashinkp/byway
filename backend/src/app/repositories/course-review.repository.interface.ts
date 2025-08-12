import { CourseReview } from "../../domain/entities/review.entity";
import {  ICourseReviewSummary, ICourseReviewQuery, ICourseReviewPaginatedResult } from "../../domain/types/review.interface";

export interface ICourseReviewRepository {
  // Basic CRUD operations
  save(review: CourseReview): Promise<CourseReview>;
  findById(id: string): Promise<CourseReview | null>;
  update(review: CourseReview): Promise<CourseReview>;
  softDelete(review: CourseReview): Promise<CourseReview>;
  restore(review: CourseReview): Promise<CourseReview>;
  delete(id: string): Promise<void>;

  // Query operations
  findByCourseId(
    courseId: string,
    query: ICourseReviewQuery,
    userId?: string
  ): Promise<ICourseReviewPaginatedResult>;

  findByUserId(
    userId: string,
    page?: number,
    limit?: number
  ): Promise<ICourseReviewPaginatedResult>;

  findByUserAndCourse(
    userId: string,
    courseId: string
  ): Promise<CourseReview | null>;

  // Statistics
  getCourseReviewStats(courseId: string): Promise<ICourseReviewSummary>;
}
