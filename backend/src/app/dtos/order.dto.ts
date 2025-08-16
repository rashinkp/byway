import { Order } from "../../domain/entities/order.entity";
import { Transaction } from "../../domain/entities/transaction.entity";
import { PaymentGateway } from "../../domain/enum/payment-gateway.enum";
import { ITransactionOutputDTO } from "./transaction.dto";

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



export interface CourseDetail {
  prerequisites: string | null;
  longDescription: string | null;
  objectives: string | null;
  targetAudience: string | null;
}

export interface CourseDto {
  id: string;
  title: string;
  description: string | null;
  level: string;
  price: number;
  thumbnail: string | null;
  status: string;
  categoryId?: string;
  createdBy: string;
  createdAt: string;
  updatedAt?: string;
  deletedAt: string | null;
  approvalStatus: string;
  details: CourseDetail | null;
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
  details: CourseDetail | null;
}

export interface OrderDto {
  id?: string;
  userId: string;
  paymentStatus: "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED";
  paymentGateway: PaymentGateway | null;
  createdAt?: Date;
  updatedAt?: Date;
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



export interface RetryOrderResponseDTO {
  order: Order;
  transaction: Transaction;
  session: {
    id: string;
    url: string;
    payment_status: string;
    amount_total: number;
  };
}



export interface CreateOrderResponseDTO {
  order: Order;
  transaction?: ITransactionOutputDTO;
  session?: {
    id: string;
    url: string;
    payment_status: string;
    amount_total: number;
  };
}