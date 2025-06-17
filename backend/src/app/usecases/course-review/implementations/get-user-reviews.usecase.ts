import { CourseReviewResponseDto } from "../../../../domain/dtos/course-review";
import { ICourseReviewRepository } from "../../../repositories/course-review.repository.interface";
import { IGetUserReviewsUseCase } from "../interfaces/get-user-reviews.usecase.interface";

export class GetUserReviewsUseCase implements IGetUserReviewsUseCase {
  constructor(
    private readonly courseReviewRepository: ICourseReviewRepository
  ) {}

  async execute(userId: string, page?: number, limit?: number): Promise<{
    reviews: CourseReviewResponseDto[];
    total: number;
    totalPages: number;
  }> {
    return await this.courseReviewRepository.findByUserId(userId, page, limit);
  }
} 