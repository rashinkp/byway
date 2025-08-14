import { CourseReviewResponseDto } from "../../../dtos/review.dto";


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
