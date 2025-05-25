import { Order } from "../../domain/entities/order.entity";

export interface IOrderRepository {
  findById(id: string): Promise<Order | null>;
  createOrder(userId: string, courses: any[], couponCode?: string): Promise<Order>;
  updateOrderStatus(
    orderId: string,
    status: string,
    paymentIntentId: string,
    paymentGateway: 'STRIPE' | 'RAZORPAY' | null
  ): Promise<Order>;
}