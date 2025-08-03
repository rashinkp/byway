import { CourseReviewSummaryDto } from "../../../dtos/course-review";
import { ICourseReviewRepository } from "../../../repositories/course-review.repository.interface";
import { IGetCourseReviewStatsUseCase } from "../interfaces/get-course-review-stats.usecase.interface";

export class GetCourseReviewStatsUseCase
  implements IGetCourseReviewStatsUseCase
{
  constructor(
    private readonly courseReviewRepository: ICourseReviewRepository
  ) {}

  async execute(courseId: string): Promise<CourseReviewSummaryDto> {
    return await this.courseReviewRepository.getCourseReviewStats(courseId);
  }
}
