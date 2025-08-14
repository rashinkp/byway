import { Course } from "../../domain/entities/course.entity";
import { User } from "../../domain/entities/user.entity";

export interface AddToCartDto {
  courseId: string; 
  couponId?: string; 
}

// Get Cart DTO
export interface GetCartDto {
  page?: number; 
  limit?: number; 
  includeDeleted?: boolean;
}

export interface RemoveFromCartDto {
  courseId: string; 
}

export interface ApplyCouponDto {
  courseId: string;
  couponId: string; 
}


export interface CartResponseDTO {
  id: string,
  userId: string,
  courseId: string,
  couponId?: string,
  discount?: number,
  createdAt: Date,
  updatedAt?: Date,
  deletedAt?: Date,
  user?: User,
  course? : Course
}