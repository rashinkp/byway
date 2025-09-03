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
    const result = await this._courseReviewRepository.getCourseReviewStats(courseId);
    
    // Map domain entities to DTOs
    return {
      averageRating: result.averageRating,
      totalReviews: result.totalReviews,
      ratingDistribution: result.ratingDistribution,
      recentReviews: result.recentReviews.map(review => ({
        id: review.id,
        courseId: review.courseId,
        userId: review.userId,
        rating: review.rating,
        title: review.title,
        comment: review.comment,
        createdAt: review.createdAt,
        updatedAt: review.updatedAt,
        deletedAt: review.deletedAt,
        user: review.user,
      })),
    };
  }
}
