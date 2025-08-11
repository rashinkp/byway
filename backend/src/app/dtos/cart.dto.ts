import { Course } from "../../domain/entities/course.entity";
import { User } from "../../domain/entities/user.entity";

// Add to Cart DTO
export interface AddToCartDto {
  courseId: string; // expected to be a UUID string
  couponId?: string; // optional UUID string
}

// Get Cart DTO
export interface GetCartDto {
  page?: number; // positive integer, default to 1 if missing (validate externally)
  limit?: number; // positive integer, default to 10 if missing (validate externally)
  includeDeleted?: boolean; // defaults to false if missing (validate externally)
}

// Remove from Cart DTO
export interface RemoveFromCartDto {
  courseId: string; // expected to be a UUID string
}

// Apply Coupon DTO
export interface ApplyCouponDto {
  courseId: string; // expected to be a UUID string
  couponId: string; // expected to be a UUID string
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