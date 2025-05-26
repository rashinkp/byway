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
  create(order: Order): Promise<Order>;
  createOrder(userId: string, courses: any[], couponCode?: string): Promise<Order>;
  update(order: Order): Promise<Order>;
  updateOrderStatus(orderId: string, status: string, paymentIntentId: string, paymentGateway: "STRIPE" | "RAZORPAY" | null): Promise<Order>;
  findMany(params: { where: any; skip: number; take: number; orderBy: any; include?: any }): Promise<Order[]>;
  count(where: any): Promise<number>;
  delete(id: string): Promise<void>;
}