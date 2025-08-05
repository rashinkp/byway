import { CourseReviewRecord } from "../records/course-review.record";

export interface ICourseReviewRepository {
  findByCourseId(courseId: string): Promise<CourseReviewRecord[]>;
  findByUserId(userId: string): Promise<CourseReviewRecord[]>;
  findByUserAndCourse(userId: string, courseId: string): Promise<CourseReviewRecord | null>;
  create(review: CourseReviewRecord): Promise<CourseReviewRecord>;
  update(review: CourseReviewRecord): Promise<CourseReviewRecord>;
  delete(id: string): Promise<void>;
  getCourseReviewStats(options: { courseId?: string }): Promise<{
    totalReviews: number;
    averageRating: number;
    ratingDistribution: { [key: number]: number };
  }>;
}
