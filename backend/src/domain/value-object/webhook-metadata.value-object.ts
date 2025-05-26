import { Course } from "../entities/course.entity";

export class WebhookMetadata {
  constructor(
    public readonly userId: string,
    public readonly orderId: string,
    public readonly courses: Course[]
  ) {}

  static create(metadata: Record<string, string>): WebhookMetadata {
    if (!metadata.userId || !metadata.orderId || !metadata.courses) {
      throw new Error("Missing required metadata fields");
    }

    const courses = JSON.parse(metadata.courses) as Course[];
    return new WebhookMetadata(metadata.userId, metadata.orderId, courses);
  }

  getCourseIds(): string[] {
    return this.courses.map(course => course.id);
  }
} 