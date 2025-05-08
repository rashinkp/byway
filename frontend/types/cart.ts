export interface Course {
  id: string;
  title: string;
  image: string;
  price: number | string; 
  offer: number | string; 
  duration: string;
  lectures: number;
  level: string;
  thumbnail?: string;
  creator: {
    name: string;
  };
}
export interface ICart {
  id: string;
  userId: string;
  courseId: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  couponId?: string | null;
  discount?: number;
  course?: Course;
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
