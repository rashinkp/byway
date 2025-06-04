import { Course } from "../entities/course.entity";

export class WebhookMetadata {
  private constructor(
    public readonly userId?: string,
    public readonly orderId?: string,
    public readonly courses?: any[],
    public readonly paymentIntentId?: string,
    public readonly status?: string,
    public readonly failureReason?: string,
    public readonly isWalletTopUp?: boolean
  ) {}

  static create(metadata: Record<string, string>): WebhookMetadata {
    // For payment failures, we can create metadata with just the failure info
    if (metadata.status === 'failed') {
      return new WebhookMetadata(
        undefined,
        undefined,
        undefined,
        metadata.paymentIntentId,
        metadata.status,
        metadata.failureReason
      );
    }

    // Parse courses if they exist
    let courses: any[] | undefined;
    if (metadata.courses) {
      try {
        courses = JSON.parse(metadata.courses);
      } catch (error) {
        console.error('Error parsing courses from metadata:', error);
      }
    }

    return new WebhookMetadata(
      metadata.userId,
      metadata.orderId,
      courses,
      metadata.paymentIntentId,
      metadata.status,
      metadata.failureReason,
      metadata.isWalletTopUp === 'true'
    );
  }

  getCourseIds(): string[] {
    return this.courses?.map(course => course.id) || [];
  }
} 