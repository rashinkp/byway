import { CreateCourseReviewDto, CourseReviewResponseDto } from "../../../../domain/dtos/course-review";

export interface ICreateCourseReviewUseCase {
  execute(input: CreateCourseReviewDto, userId: string): Promise<CourseReviewResponseDto>;
} 