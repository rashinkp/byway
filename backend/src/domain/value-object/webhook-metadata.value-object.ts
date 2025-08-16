export class WebhookMetadata {
  private constructor(
    public readonly userId?: string,
    public readonly orderId?: string,
    public readonly courseIds?: string[],
    public readonly courses?: Record<string, unknown>[],
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
        undefined,
        metadata.paymentIntentId,
        metadata.status,
        metadata.failureReason
      );
    }

    // Parse course IDs if they exist
    let courseIds: string[] | undefined;
    if (metadata.courseIds) {
      try {
        courseIds = JSON.parse(metadata.courseIds);
      } catch (error) {
        console.error('Error parsing course IDs from metadata:', error);
      }
    }

    // Parse courses if they exist (for backward compatibility)
    let courses: Record<string, unknown>[] | undefined;
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
      courseIds,
      courses,
      metadata.paymentIntentId,
      metadata.status,
      metadata.failureReason,
      metadata.isWalletTopUp === 'true'
    );
  }

  getCourseIds(): string[] {
    // Prefer courseIds over courses for backward compatibility
    if (this.courseIds) {
      return this.courseIds;
    }
    return this.courses?.map(course => (course.id as string)) || [];
  }
} 