
import { CourseReviewResponseDto, QueryCourseReviewDto } from "../../../dtos/review.dto";
import { ICourseReviewRepository } from "../../../repositories/course-review.repository.interface";
import { IGetCourseReviewsUseCase } from "../interfaces/get-course-reviews.usecase.interface";

export class GetCourseReviewsUseCase implements IGetCourseReviewsUseCase {
  constructor(
    private readonly courseReviewRepository: ICourseReviewRepository
  ) {}

  async execute(
    input: QueryCourseReviewDto,
    userId?: string
  ): Promise<{
    reviews: CourseReviewResponseDto[];
    total: number;
    totalPages: number;
  }> {
    // Set default values for pagination
    const query: QueryCourseReviewDto = {
      courseId: input.courseId,
      page: input.page || 1,
      limit: input.limit || 10,
      rating: input.rating,
      sortBy: input.sortBy || "createdAt",
      sortOrder: input.sortOrder || "desc",
      isMyReviews: input.isMyReviews || false,
      includeDisabled: input.includeDisabled || false,
    };

    // If isMyReviews is true, we need userId
    if (query.isMyReviews && !userId) {
      throw new Error("User ID is required when filtering for my reviews");
    }

    // Get reviews from repository
    return await this.courseReviewRepository.findByCourseId(
      query.courseId,
      query,
      userId
    );
  }
}
