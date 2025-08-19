import { CourseReview } from "../../domain/entities/review.entity";
import {  ICourseReviewSummary, ICourseReviewQuery, ICourseReviewPaginatedResult } from "../../domain/types/review.interface";
import { IGenericRepository } from "./base/generic-repository.interface";

export interface ICourseReviewRepository extends IGenericRepository<CourseReview> {
  // Basic CRUD operations
  save(review: CourseReview): Promise<CourseReview>;
  restoreReview(review: CourseReview): Promise<CourseReview>;

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
