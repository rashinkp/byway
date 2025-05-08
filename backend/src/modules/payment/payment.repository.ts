import { PrismaClient } from "@prisma/client";
import { IOrderRepository } from "./payment.repository.interface";
import { IOrder } from "./payment.types";

export class OrderRepository implements IOrderRepository {
  constructor(private prisma: PrismaClient) {}

  async createOrder(data: {
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
  }): Promise<IOrder> {
    return this.prisma.order.create({
      data: {
        userId: data.userId,
        amount: data.amount,
        paymentStatus: data.paymentStatus,
        paymentGateway: data.paymentGateway,
        orderStatus: data.orderStatus,
        items: {
          create: data.items.map((item) => ({
            courseId: item.courseId,
            coursePrice: item.coursePrice,
            discount: item.discount,
            couponId: item.couponId,
          })),
        },
      },
      include: {
        items: true,
      },
    }) as unknown as Promise<IOrder>;
  }

  async findOrderById(orderId: string): Promise<IOrder | null> {
    return this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: true,
      },
    }) as unknown as Promise<IOrder | null>;
  }

  async updateOrderStatus(
    orderId: string,
    paymentStatus: "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED",
    orderStatus: "PENDING" | "CONFIRMED" | "CANCELLED",
    paymentId?: string,
    paymentGateway?: "STRIPE" | "PAYPAL" | "RAZORPAY" | null
  ): Promise<IOrder> {
    return this.prisma.order.update({
      where: { id: orderId },
      data: {
        paymentStatus,
        orderStatus,
        paymentId,
        paymentGateway,
      },
      include: {
        items: true,
      },
    }) as unknown as Promise<IOrder>;
  }
}
