import { Course } from "../entities/course.entity";

export class WebhookMetadata {
  private constructor(
    public readonly userId?: string,
    public readonly orderId?: string,
    public readonly courses?: any[],
    public readonly paymentIntentId?: string,
    public readonly status?: string,
    public readonly failureReason?: string
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

    // For successful payments, require the standard fields
    const { userId, orderId, courses } = metadata;
    if (!userId || !orderId || !courses) {
      throw new Error("Missing required metadata fields");
    }

    return new WebhookMetadata(
      userId,
      orderId,
      JSON.parse(courses),
      metadata.paymentIntentId,
      metadata.status,
      metadata.failureReason
    );
  }

  getCourseIds(): string[] {
    return this.courses?.map(course => course.id) || [];
  }
} 