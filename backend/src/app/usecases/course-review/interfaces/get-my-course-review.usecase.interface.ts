import { CourseReviewResponseDto } from "../../../dtos/review.dto";


export interface IGetMyCourseReviewUseCase {
  execute(
    courseId: string,
    userId: string
  ): Promise<CourseReviewResponseDto | null>;
}
