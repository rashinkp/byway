import { CourseReviewResponseDto, UpdateCourseReviewDto } from "../../../dtos/review.dto";


export interface IUpdateCourseReviewUseCase {
  execute(
    reviewId: string,
    input: UpdateCourseReviewDto,
    userId: string
  ): Promise<CourseReviewResponseDto>;
}
