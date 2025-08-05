// ============================================================================
// CART REQUEST DTOs
// ============================================================================

export interface AddToCartRequestDto {
  courseId: string;
  couponId?: string;
}

export interface GetCartRequestDto {
  page?: number;
  limit?: number;
  includeDeleted?: boolean;
}

export interface RemoveFromCartRequestDto {
  courseId: string;
}

export interface ApplyCouponRequestDto {
  courseId: string;
  couponId: string;
}

export interface RemoveCouponRequestDto {
  courseId: string;
}

export interface ClearCartRequestDto {
  userId: string;
}

// ============================================================================
// CART RESPONSE DTOs
// ============================================================================

export interface CartItemResponseDto {
  id: string;
  userId: string;
  courseId: string;
  couponId?: string;
  discount?: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  course: {
    id: string;
    title: string;
    description?: string;
    price?: number;
    thumbnail?: string;
    duration?: number;
    level: string;
    instructor: {
      id: string;
      name: string;
      avatar?: string;
    };
  };
  coupon?: {
    id: string;
    code: string;
    discountPercentage: number;
    maxDiscount: number;
    minAmount: number;
    expiresAt: Date;
  };
}

export interface CartSummaryResponseDto {
  items: CartItemResponseDto[];
  total: number;
  totalPage: number;
  subtotal: number;
  discount: number;
  finalTotal: number;
  itemCount: number;
} 