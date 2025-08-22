import { ICourseReviewRepository } from "../../../repositories/course-review.repository.interface";
import { IDeleteCourseReviewUseCase } from "../interfaces/delete-course-review.usecase.interface";

export class DeleteCourseReviewUseCase implements IDeleteCourseReviewUseCase {
  constructor(
    private readonly _courseReviewRepository: ICourseReviewRepository
  ) {}

  async execute(reviewId: string, userId: string): Promise<void> {
    // Find the review
    const review = await this._courseReviewRepository.findById(reviewId);
    if (!review) {
      throw new Error("Review not found");
    }

    // Check if user can delete this review
    if (!review.canBeDeletedBy(userId)) {
      throw new Error("You can only delete your own reviews");
    }

    // Soft delete the review
    review.softDelete();

    // Save to repository
    await this._courseReviewRepository.softDelete(review);
  }
} 