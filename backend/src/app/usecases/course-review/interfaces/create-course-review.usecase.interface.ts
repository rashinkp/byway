import {
  CreateCourseReviewDto,
  CourseReviewResponseDto,
} from "../../../dtos/course-review";

export interface ICreateCourseReviewUseCase {
  execute(
    input: CreateCourseReviewDto,
    userId: string
  ): Promise<CourseReviewResponseDto>;
}
