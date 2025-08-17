import { CourseReviewSummaryDto } from "../../../dtos/review.dto";
import { ICourseReviewRepository } from "../../../repositories/course-review.repository.interface";
import { IGetCourseReviewStatsUseCase } from "../interfaces/get-course-review-stats.usecase.interface";

export class GetCourseReviewStatsUseCase
  implements IGetCourseReviewStatsUseCase
{
  constructor(
    private readonly _courseReviewRepository: ICourseReviewRepository
  ) {}

  async execute(courseId: string): Promise<CourseReviewSummaryDto> {
    return await this._courseReviewRepository.getCourseReviewStats(courseId);
  }
}
