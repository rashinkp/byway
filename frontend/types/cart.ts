export interface ICart {
  id: string;
  userId: string;
  courseId: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  couponId?: string | null;
  discount?: number;
}

export interface Course {
  id: string;
  title: string;
  instructor: string;
  image: string;
  price: number;
  originalPrice: number;
  duration: string;
  lectures: number;
  level: string;
}

export interface ICartFormData {
  courseId: string;
}

export interface IApplyCouponInput {
  couponCode: string;
}

export interface ICoupon {
  id: string;
  code: string;
  discountType: "PERCENTAGE" | "FIXED";
  discountValue: number;
  minAmount?: number;
  maxAmount?: number;
  expiresAt?: string | null;
}

export interface ICartListOutput {
  cartItems: ICart[];
  total: number;
}

export interface IGetCartResponse {
  status: string;
  data: ICartListOutput;
  message: string;
  statusCode: number;
}

export interface IGetCartInput {
  page?: number;
  limit?: number;
  includeDeleted?: boolean;
}