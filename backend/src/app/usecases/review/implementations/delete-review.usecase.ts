import { ICourseReviewRepository } from "../../../repositories/course-review.repository.interface";
import { IDeleteReviewUseCase } from "../interfaces/delete-review.usecase.interface";

export class DeleteReviewUseCase implements IDeleteReviewUseCase {
  constructor(
    private readonly _courseReviewRepository: ICourseReviewRepository
  ) {}

  async execute(reviewId: string, userId: string): Promise<void> {
    // Find the review
    const review = await this._courseReviewRepository.findById(reviewId);
    if (!review) {
      throw new Error("Review not found");
    }
    // Only the creator can delete
    if (review.userId !== userId) {
      throw new Error("You can only delete your own reviews");
    }
    await this._courseReviewRepository.delete(reviewId);
  }
} 