import {
  UpdateCourseReviewDto,
  CourseReviewResponseDto,
} from "../../../dtos/course-review";

export interface IUpdateCourseReviewUseCase {
  execute(
    reviewId: string,
    input: UpdateCourseReviewDto,
    userId: string
  ): Promise<CourseReviewResponseDto>;
}
