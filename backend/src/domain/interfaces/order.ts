import { Course } from "../entities/course.entity";

export interface OrderItemProps {
  id: string;
  orderId: string;
  courseId: string;
  courseTitle: string;
  coursePrice: number;
  discount?: number | null;
  couponId?: string | null;
  course: Course;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}
