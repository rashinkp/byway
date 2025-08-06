import { Course } from "../entities/course.entity";
import { User } from "../entities/user.entity";

// Interface for Cart properties
export interface CartInterface {
  id: string;
  userId: string;
  courseId: string;
  couponId?: string;
  discount?: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
  user?: User;
  course?: Course;
}
