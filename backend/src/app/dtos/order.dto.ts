export interface GetAllOrdersDto {
  page?: number; // default 1
  limit?: number; // default 10
  sortBy?: "createdAt" | "amount" | "status"; // default "createdAt"
  sortOrder?: "asc" | "desc"; // default "desc"
  status?: "ALL" | "COMPLETED" | "PENDING" | "FAILED"; // default "ALL"
  startDate?: string;
  endDate?: string;
  minAmount?: number;
  maxAmount?: number;
}

export interface CourseDto {
  id: string;
  title: string;
  description: string | null;
  level: string;
  price: number;
  thumbnail: string | null;
  status: string;
  categoryId: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  approvalStatus: string;
  details: any | null;
  offer?: number;
}

export interface OrderItemDto {
  orderId: string;
  courseId: string;
  courseTitle: string;
  coursePrice: number;
  discount: number | null;
  couponId: string | null;
  title: string;
  description: string | null;
  level: string;
  price: number | null;
  thumbnail: string | null;
  status: string;
  categoryId: string;
  createdBy: string;
  deletedAt: string | null;
  approvalStatus: string;
  details: any | null;
}

export interface OrderDto {
  id: string;
  userId: string;
  amount: number;
  paymentStatus: "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED";
  orderStatus: "PENDING" | "CONFIRMED" | "CANCELLED" | "FAILED" | "COMPLETED";
  paymentId: string | null;
  paymentGateway: "STRIPE" | "PAYPAL" | "RAZORPAY" | null;
  createdAt: string;
  updatedAt: string;
  items: OrderItemDto[];
}

export interface OrdersResponseDto {
  orders: OrderDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}



export type PaymentMethod = "WALLET" | "STRIPE" | "PAYPAL" | "RAZORPAY";

export interface CreateOrderDto {
  courses: CourseDto[];
  paymentMethod: PaymentMethod;
  couponCode?: string;
}