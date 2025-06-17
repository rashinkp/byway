export interface IDisableReviewUseCase {
  execute(reviewId: string, adminId: string): Promise<{ action: 'disabled' | 'enabled' }>;
} 