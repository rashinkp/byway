import { Order } from "../../domain/entities/order.entity";
import { PaymentGateway } from "../../domain/enum/payment-gateway.enum";
import { Course } from "../../domain/entities/course.entity";
import { OrderStatus } from "../../domain/enum/order-status.enum";
import { OrderFilters, PaginatedOrderResult, OrderItemCreation, CourseOrderData } from "../../domain/types/order.interface";

export interface IOrderRepository {
  findAll(
    userId: string,
    filters: OrderFilters
  ): Promise<PaginatedOrderResult>;
  findById(id: string): Promise<Order | null>;
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
    where: any;
    skip: number;
    take: number;
    orderBy: any;
    include?: any;
  }): Promise<Order[]>;
  count(where: any): Promise<number>;
  create(order: Order): Promise<Order>;
  update(order: Order): Promise<Order>;
  delete(id: string): Promise<void>;
  createOrderItems(
    orderId: string,
    courses: CourseOrderData[]
  ): Promise<OrderItemCreation[]>;
  findOrderItems(
    orderId: string
  ): Promise<OrderItemCreation[]>;
  findCourseById(courseId: string): Promise<Course | null>;
}
