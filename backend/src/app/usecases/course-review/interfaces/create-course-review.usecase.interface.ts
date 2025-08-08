import { CourseReviewResponseDto, CreateCourseReviewDto } from "../../../dtos/review.dto";


export interface ICreateCourseReviewUseCase {
  execute(
    input: CreateCourseReviewDto,
    userId: string
  ): Promise<CourseReviewResponseDto>;
}
