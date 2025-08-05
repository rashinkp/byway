// ============================================================================
// ORDER REQUEST DTOs
// ============================================================================

export interface GetAllOrdersRequestDto {
  page?: number;
  limit?: number;
  sortBy?: "createdAt" | "amount" | "status";
  sortOrder?: "asc" | "desc";
  status?: "ALL" | "COMPLETED" | "PENDING" | "FAILED";
  startDate?: string;
  endDate?: string;
  minAmount?: number;
  maxAmount?: number;
}

export interface GetOrderByIdRequestDto {
  orderId: string;
}

export interface GetUserOrdersRequestDto {
  userId: string;
  page?: number;
  limit?: number;
  status?: "ALL" | "COMPLETED" | "PENDING" | "FAILED";
}

export interface CreateOrderRequestDto {
  userId: string;
  courseIds: string[];
  paymentGateway: "STRIPE" | "PAYPAL" | "RAZORPAY";
  couponId?: string;
}

export interface UpdateOrderStatusRequestDto {
  orderId: string;
  orderStatus: "PENDING" | "CONFIRMED" | "CANCELLED" | "FAILED" | "COMPLETED";
  paymentStatus: "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED";
  paymentId?: string;
}

// ============================================================================
// ORDER RESPONSE DTOs
// ============================================================================

export interface CourseResponseDto {
  id: string;
  title: string;
  description?: string;
  level: string;
  price: number;
  thumbnail?: string;
  status: string;
  categoryId: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  approvalStatus: string;
  details?: any;
}

export interface OrderItemResponseDto {
  orderId: string;
  courseId: string;
  courseTitle: string;
  coursePrice: number;
  discount?: number;
  couponId?: string;
  title: string;
  description?: string;
  level: string;
  price?: number;
  thumbnail?: string;
  status: string;
  categoryId: string;
  createdBy: string;
  deletedAt?: string;
  approvalStatus: string;
  details?: any;
}

export interface OrderResponseDto {
  id: string;
  userId: string;
  amount: number;
  paymentStatus: "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED";
  orderStatus: "PENDING" | "CONFIRMED" | "CANCELLED" | "FAILED" | "COMPLETED";
  paymentId?: string;
  paymentGateway?: "STRIPE" | "PAYPAL" | "RAZORPAY";
  createdAt: string;
  updatedAt: string;
  items: OrderItemResponseDto[];
}

export interface OrdersListResponseDto {
  orders: OrderResponseDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface OrderSummaryResponseDto {
  totalOrders: number;
  completedOrders: number;
  pendingOrders: number;
  failedOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
} 