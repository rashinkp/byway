import { OrderRecord } from "../records/order.record";
import { OrderItemRecord } from "../records/order-item.record";
import { CourseRecord } from "../records/course.record";
import { PaymentGateway } from "../../domain/enum/payment-gateway.enum";
import { OrderStatus } from "../../domain/enum/order-status.enum";

export interface IOrderRepository {
  findAll(options: {
    userId: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    status?: string;
    paymentStatus?: string;
    search?: string;
  }): Promise<{ orders: OrderRecord[]; total: number; page: number; limit: number; totalPages: number }>;
  findById(id: string): Promise<OrderRecord | null>;
  findByPaymentId(paymentId: string): Promise<OrderRecord | null>;
  getAllOrders(userId: string): Promise<OrderRecord[]>;
  createOrder(options: {
    userId: string;
    courses: any[];
    paymentMethod: PaymentGateway;
    couponCode?: string;
  }): Promise<OrderRecord>;
  updateOrderStatus(orderId: string, status: OrderStatus, paymentId: string, paymentGateway: PaymentGateway): Promise<void>;
  findMany(params: {
    where: any;
    skip: number;
    take: number;
    orderBy: any;
    include?: any;
  }): Promise<OrderRecord[]>;
  count(where: any): Promise<number>;
  create(order: OrderRecord): Promise<OrderRecord>;
  update(order: OrderRecord): Promise<OrderRecord>;
  delete(id: string): Promise<void>;
  createOrderItems(orderId: string, courses: any[]): Promise<{ id: string; orderId: string; courseId: string }[]>;
  findOrderItems(orderId: string): Promise<OrderItemRecord[]>;
  findCourseById(courseId: string): Promise<CourseRecord | null>;
}
