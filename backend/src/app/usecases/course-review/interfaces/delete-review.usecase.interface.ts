export interface IDeleteReviewUseCase {
  execute(reviewId: string, userId: string): Promise<void>;
} 