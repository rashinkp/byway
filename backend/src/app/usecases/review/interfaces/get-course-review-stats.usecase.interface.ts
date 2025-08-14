import { CourseReviewSummaryDto } from "../../../dtos/review.dto";


export interface IGetCourseReviewStatsUseCase {
  execute(courseId: string): Promise<CourseReviewSummaryDto>;
}
