import { Order } from "../../domain/entities/order.entity";
import { GetAllOrdersDto } from "../../domain/dtos/order/order.dto";

export interface IOrderRepository {
  findAll(userId: string, filters: GetAllOrdersDto): Promise<{
    orders: Order[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }>;
  findById(id: string): Promise<Order | null>;
  findByPaymentId(paymentId: string): Promise<Order | null>;
  getAllOrders(userId: string): Promise<Order[]>;
  createOrder(userId: string, courses: any[], couponCode?: string): Promise<Order>;
  updateOrderStatus(
    orderId: string,
    status: "PENDING" | "COMPLETED" | "FAILED" | "CANCELLED",
    paymentId: string,
    paymentGateway: string
  ): Promise<void>;
  findMany(params: { where: any; skip: number; take: number; orderBy: any; include?: any }): Promise<Order[]>;
  count(where: any): Promise<number>;
  create(order: Order): Promise<Order>;
  update(order: Order): Promise<Order>;
  delete(id: string): Promise<void>;
}