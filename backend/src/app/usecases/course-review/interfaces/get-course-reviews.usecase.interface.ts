import {
  QueryCourseReviewDto,
  CourseReviewResponseDto,
} from "../../../dtos/course-review";

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
