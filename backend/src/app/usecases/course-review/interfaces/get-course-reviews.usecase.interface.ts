import { QueryCourseReviewDto, CourseReviewResponseDto } from "../../../../domain/dtos/course-review";

export interface IGetCourseReviewsUseCase {
  execute(input: QueryCourseReviewDto): Promise<{
    reviews: CourseReviewResponseDto[];
    total: number;
    totalPages: number;
  }>;
} 