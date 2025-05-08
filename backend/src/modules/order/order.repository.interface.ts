import { IOrder } from "./order.types";

export interface IOrderRepository {
  createOrder(data: {
    userId: string;
    items: {
      courseId: string;
      coursePrice: number;
      discount: number;
      couponId: string | null;
    }[];
    amount: number;
    paymentStatus: "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED";
    paymentGateway: "STRIPE" | "PAYPAL" | "RAZORPAY" | null;
    orderStatus: "PENDING" | "CONFIRMED" | "CANCELLED";
  }): Promise<IOrder>;
  findOrderById(orderId: string): Promise<IOrder | null>;
  updateOrderStatus(
    orderId: string,
    paymentStatus: "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED",
    orderStatus: "PENDING" | "CONFIRMED" | "CANCELLED",
    paymentId?: string,
    paymentGateway?: "STRIPE" | "PAYPAL" | "RAZORPAY" | null
  ): Promise<IOrder>;
}
