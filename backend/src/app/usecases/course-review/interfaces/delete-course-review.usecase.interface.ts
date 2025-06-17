export interface IDeleteCourseReviewUseCase {
  execute(reviewId: string, userId: string): Promise<void>;
} 