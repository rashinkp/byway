import { CourseReviewSummaryDto } from "../../../dtos/course-review";

export interface IGetCourseReviewStatsUseCase {
  execute(courseId: string): Promise<CourseReviewSummaryDto>;
}
