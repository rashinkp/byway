import { UpdateCourseReviewDto, CourseReviewResponseDto } from "../../../../domain/dtos/course-review";

export interface IUpdateCourseReviewUseCase {
  execute(reviewId: string, input: UpdateCourseReviewDto, userId: string): Promise<CourseReviewResponseDto>;
} 