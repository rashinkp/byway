import { Order } from "../../domain/entities/order.entity";
import { GetAllOrdersDto } from "../dtos/order.dto";
import { PaymentGateway } from "../../domain/enum/payment-gateway.enum";
import { Course } from "../../domain/entities/course.entity";
import { OrderStatus } from "../../domain/enum/order-status.enum";

export interface IOrderRepository {
  findAll(
    userId: string,
    filters: GetAllOrdersDto
  ): Promise<{
    orders: Order[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }>;
  findById(id: string): Promise<Order | null>;
  findByPaymentId(paymentId: string): Promise<Order | null>;
  getAllOrders(userId: string): Promise<Order[]>;
  createOrder(
    userId: string,
    courses: any[],
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
    courses: any[]
  ): Promise<{ id: string; orderId: string; courseId: string }[]>;
  findOrderItems(
    orderId: string
  ): Promise<{ id: string; orderId: string; courseId: string }[]>;
  findCourseById(courseId: string): Promise<Course | null>;
}
