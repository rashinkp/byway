import { QueryCourseReviewDto, CourseReviewResponseDto } from "../../../../domain/dtos/course-review";

export interface IGetCourseReviewsUseCase {
  execute(input: QueryCourseReviewDto, userId?: string): Promise<{
    reviews: CourseReviewResponseDto[];
    total: number;
    totalPages: number;
  }>;
} 