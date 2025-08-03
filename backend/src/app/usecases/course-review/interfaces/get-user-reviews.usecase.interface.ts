import { CourseReviewResponseDto } from "../../../dtos/course-review";

export interface IGetUserReviewsUseCase {
  execute(
    userId: string,
    page?: number,
    limit?: number
  ): Promise<{
    reviews: CourseReviewResponseDto[];
    total: number;
    totalPages: number;
  }>;
}
