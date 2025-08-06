import { Cart } from "../../domain/entities/cart.entity";
import { Course } from "../../domain/entities/course.entity";
import {
  AddToCartRequestDto,
  GetCartRequestDto,
  RemoveFromCartRequestDto,
  ApplyCouponRequestDto,
  RemoveCouponRequestDto,
  ClearCartRequestDto,
  CartItemResponseDto,
  CartSummaryResponseDto,
} from "../dtos/cart.dto";

export class CartMapper {
  // Domain Entity to Response DTOs
  static toCartItemResponseDto(
    cart: Cart,
    course: Course,
    additionalData?: {
      finalPrice?: number;
      discountAmount?: number;
    }
  ): CartItemResponseDto {
    return {
      id: cart.id,
      courseId: cart.courseId,
      course: {
        id: course.id,
        title: course.title,
        description: course.description,
        level: course.level,
        price: course.price,
        thumbnail: course.thumbnail,
        duration: course.duration,
        offer: course.offer,
        status: course.status,
        categoryId: course.categoryId,
        createdBy: course.createdBy,
        createdAt: course.createdAt,
        updatedAt: course.updatedAt,
        deletedAt: course.deletedAt,
        approvalStatus: course.approvalStatus,
        adminSharePercentage: course.adminSharePercentage,
        instructorSharePercentage: 100 - course.adminSharePercentage,
      },
      finalPrice: additionalData?.finalPrice || course.getFinalPrice(),
      discountAmount: additionalData?.discountAmount || 0,
      addedAt: cart.createdAt,
    };
  }

  static toCartSummaryResponseDto(
    items: CartItemResponseDto[],
    summary: {
      subtotal: number;
      discountAmount: number;
      couponDiscount: number;
      total: number;
      itemCount: number;
      couponCode?: string;
    }
  ): CartSummaryResponseDto {
    return {
      items,
      subtotal: summary.subtotal,
      discountAmount: summary.discountAmount,
      couponDiscount: summary.couponDiscount,
      total: summary.total,
      itemCount: summary.itemCount,
      couponCode: summary.couponCode,
    };
  }
}