import { QueryCourseReviewDto, CourseReviewResponseDto } from "../../../../domain/dtos/course-review";
import { ICourseReviewRepository } from "../../../repositories/course-review.repository.interface";
import { IGetCourseReviewsUseCase } from "../interfaces/get-course-reviews.usecase.interface";

export class GetCourseReviewsUseCase implements IGetCourseReviewsUseCase {
  constructor(
    private readonly courseReviewRepository: ICourseReviewRepository
  ) {}

  async execute(input: QueryCourseReviewDto): Promise<{
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
      sortBy: input.sortBy || 'createdAt',
      sortOrder: input.sortOrder || 'desc',
    };

    // Get reviews from repository
    return await this.courseReviewRepository.findByCourseId(query.courseId, query);
  }
} 