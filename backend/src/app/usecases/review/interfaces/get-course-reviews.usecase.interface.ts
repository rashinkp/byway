import { CourseReviewResponseDto, QueryCourseReviewDto } from "../../../dtos/review.dto";


export interface IGetCourseReviewsUseCase {
  execute(
    input: QueryCourseReviewDto,
    userId?: string
  ): Promise<{
    reviews: CourseReviewResponseDto[];
    total: number;
    totalPages: number;
  }>;
}
