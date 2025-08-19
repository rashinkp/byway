
import { Rating } from "../../../../domain/value-object/rating";
import { CourseReviewResponseDto, UpdateCourseReviewDto } from "../../../dtos/review.dto";
import { ICourseReviewRepository } from "../../../repositories/course-review.repository.interface";
import { IUpdateCourseReviewUseCase } from "../interfaces/update-course-review.usecase.interface";

export class UpdateCourseReviewUseCase implements IUpdateCourseReviewUseCase {
  constructor(
    private readonly _courseReviewRepository: ICourseReviewRepository
  ) {}

  async execute(
    reviewId: string,
    input: UpdateCourseReviewDto,
    userId: string
  ): Promise<CourseReviewResponseDto> {
    // Find the review
    const review = await this._courseReviewRepository.findById(reviewId);
    if (!review) {
      throw new Error("Review not found");
    }

    // Check if user can update this review
    if (!review.canBeUpdatedBy(userId)) {
      throw new Error("You can only update your own reviews");
    }

    // Prepare update data
    const updateData: {
      rating?: Rating;
      title?: string | null;
      comment?: string | null;
    } = {};

    if (input.rating !== undefined) {
      updateData.rating = new Rating(input.rating);
    }
    if (input.title !== undefined) {
      updateData.title = input.title;
    }
    if (input.comment !== undefined) {
      updateData.comment = input.comment;
    }

    // Update the review
    review.updateReview(updateData);

    // Save to repository
    const updatedReview = await this._courseReviewRepository.update(review.id, review);

    // Return response DTO
    return {
      id: updatedReview.id,
      courseId: updatedReview.courseId,
      userId: updatedReview.userId,
      rating: updatedReview.rating.value,
      title: updatedReview.title,
      comment: updatedReview.comment,
      createdAt: updatedReview.createdAt,
      updatedAt: updatedReview.updatedAt,
    };
  }
}
