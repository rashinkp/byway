import { Order } from "../../domain/entities/order.entity";
import { PaymentGateway } from "../../domain/enum/payment-gateway.enum";
import { Course } from "../../domain/entities/course.entity";
import { OrderStatus } from "../../domain/enum/order-status.enum";
import { OrderFilters, PaginatedOrderResult, OrderItemCreation, CourseOrderData } from "../../domain/types/order.interface";
import { IGenericRepository } from "./base/generic-repository.interface";

export interface IOrderRepository extends IGenericRepository<Order> {
  findAll(
    userId: string,
    filters: OrderFilters
  ): Promise<PaginatedOrderResult>;
  findByPaymentId(paymentId: string): Promise<Order | null>;
  getAllOrders(userId: string): Promise<Order[]>;
  createOrder(
    userId: string,
    courses: CourseOrderData[],
    paymentMethod: PaymentGateway,
    couponCode?: string
  ): Promise<Order>;
  updateOrderStatus(
    orderId: string,
    status: OrderStatus,
    paymentId: string,
    paymentGateway: PaymentGateway
  ): Promise<void>;
  findMany(params: {
    where: Record<string, unknown>;
    skip: number;
    take: number;
    orderBy: Record<string, 'asc' | 'desc' | undefined>;
    include?: Record<string, unknown>;
  }): Promise<Order[]>;
  count(where: Record<string, unknown>): Promise<number>;
  createOrderItems(
    orderId: string,
    courses: CourseOrderData[]
  ): Promise<OrderItemCreation[]>;
  findOrderItems(
    orderId: string
  ): Promise<OrderItemCreation[]>;
  findCourseById(courseId: string): Promise<Course | null>;
}
