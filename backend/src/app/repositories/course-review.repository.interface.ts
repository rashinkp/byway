import { CourseReview } from "../../domain/entities/review.entity";
import {
  QueryCourseReviewDto,
  CourseReviewResponseDto,
  CourseReviewSummaryDto,
} from "../dtos/course-review";

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
    query: QueryCourseReviewDto,
    userId?: string
  ): Promise<{
    reviews: CourseReviewResponseDto[];
    total: number;
    totalPages: number;
  }>;

  findByUserId(
    userId: string,
    page?: number,
    limit?: number
  ): Promise<{
    reviews: CourseReviewResponseDto[];
    total: number;
    totalPages: number;
  }>;

  findByUserAndCourse(
    userId: string,
    courseId: string
  ): Promise<CourseReview | null>;

  // Statistics
  getCourseReviewStats(courseId: string): Promise<CourseReviewSummaryDto>;
}
