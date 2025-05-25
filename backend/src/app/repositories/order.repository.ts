import { Order } from "../../domain/entities/order.entity";

export interface IOrderRepository {
  findMany(params: {
    where: any;
    skip: number;
    take: number;
    orderBy: any;
    include?: any;
  }): Promise<Order[]>;
  count(where: any): Promise<number>;
  findById(id: string): Promise<Order | null>;
  create(data: Partial<Order>): Promise<Order>;
  update(id: string, data: Partial<Order>): Promise<Order>;
  delete(id: string): Promise<void>;
  createOrder(userId: string, courses: any[], couponCode?: string): Promise<Order>;
  updateOrderStatus(
    orderId: string,
    status: string,
    paymentIntentId: string,
    paymentGateway: 'STRIPE' | 'RAZORPAY' | null
  ): Promise<Order>;
  getAllOrders(userId: string): Promise<Order[]>;
}