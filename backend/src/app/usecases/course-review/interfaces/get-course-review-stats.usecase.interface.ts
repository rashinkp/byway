import { CourseReviewSummaryDto } from "../../../../domain/dtos/course-review";

export interface IGetCourseReviewStatsUseCase {
  execute(courseId: string): Promise<CourseReviewSummaryDto>;
} 