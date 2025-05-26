import { Course } from "./course.entity";

export class OrderItem {
  constructor(
    public readonly id: string,
    public readonly orderId: string,
    public readonly courseId: string,
    public readonly courseTitle: string,
    public readonly coursePrice: number,
    public readonly discount: number | null,
    public readonly couponId: string | null,
    public readonly course: Course,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}
} 