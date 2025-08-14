import { ICourseReviewRepository } from "../../../repositories/course-review.repository.interface";
import { IDisableReviewUseCase } from "../interfaces/disable-review.usecase.interface";

export class DisableReviewUseCase implements IDisableReviewUseCase {
  constructor(
    private readonly courseReviewRepository: ICourseReviewRepository
  ) {}

  async execute(reviewId: string): Promise<{ action: 'disabled' | 'enabled' }> {
    // Find the review
    const review = await this.courseReviewRepository.findById(reviewId);
    if (!review) {
      throw new Error("Review not found");
    }

    // Toggle: if disabled, enable it; if enabled, disable it
    if (review.isDeleted()) {
      // Enable the review (restore)
      review.restore();
      await this.courseReviewRepository.restore(review);
      return { action: 'enabled' };
    } else {
      // Disable the review
      review.softDelete();
      await this.courseReviewRepository.softDelete(review);
      return { action: 'disabled' };
    }
  }
} 