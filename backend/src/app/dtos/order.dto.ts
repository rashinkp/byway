export interface IGetAllOrdersDto {
  page?: number; // default 1 applied outside
  limit?: number; // default 10 applied outside
  sortBy?: "createdAt" | "amount" | "status"; // default "createdAt"
  sortOrder?: "asc" | "desc"; // default "desc"
  status?: "ALL" | "COMPLETED" | "PENDING" | "FAILED"; // default "ALL"
  startDate?: string; // ISO date string optional
  endDate?: string; // ISO date string optional
  minAmount?: number;
  maxAmount?: number;
}

export interface ICourseDto {
  id: string;
  title: string;
  description?: string | null;
  level: string;
  price: number;
  thumbnail?: string | null;
  status: string;
  categoryId: string;
  createdBy: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  deletedAt?: string | null;
  approvalStatus: string;
  details?: any | null;
}

export interface IOrderItemDto {
  orderId: string;
  courseId: string;
  courseTitle: string;
  coursePrice: number;
  discount?: number | null;
  couponId?: string | null;
  title: string;
  description?: string | null;
  level: string;
  price?: number | null;
  thumbnail?: string | null;
  status: string;
  categoryId: string;
  createdBy: string;
  deletedAt?: string | null;
  approvalStatus: string;
  details?: any | null;
}

export type PaymentStatus = "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED";
export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "CANCELLED"
  | "FAILED"
  | "COMPLETED";
export type PaymentGateway = "STRIPE" | "PAYPAL" | "RAZORPAY";

export interface IOrderDto {
  id: string;
  userId: string;
  amount: number;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  paymentId?: string | null;
  paymentGateway?: PaymentGateway | null;
  createdAt: string;
  updatedAt: string;
  items: IOrderItemDto[];
}

export interface IOrdersResponseDto {
  orders: IOrderDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export type PaymentMethod = "WALLET" | "STRIPE" | "PAYPAL" | "RAZORPAY";

export interface ICreateOrderCourseDto {
  id: string;
  title: string;
  description?: string;
  price: number;
  offer?: number;
  thumbnail?: string;
  duration?: string;
  level?: string;
}

export interface ICreateOrderDto {
  courses: ICreateOrderCourseDto[];
  paymentMethod: PaymentMethod;
  couponCode?: string;
}
