import { PrismaClient } from "@prisma/client";
import { IOrderRepository } from "../../app/repositories/order.repository";
import { Order } from "../../domain/entities/order.entity";
import { v4 as uuidv4 } from "uuid";
import { OrderStatus } from "../../domain/enum/order-status.enum";
import { PaymentStatus } from "../../domain/enum/payment-status.enum";
import { PaymentGateway } from "../../domain/enum/payment-gateway.enum";

export class OrderRepository implements IOrderRepository {
  constructor(private prisma: PrismaClient) {}

  private mapToOrder(prismaOrder: any): Order {
    return new Order(
      prismaOrder.id,
      prismaOrder.userId,
      prismaOrder.orderStatus as OrderStatus,
      prismaOrder.paymentStatus as PaymentStatus,
      prismaOrder.paymentId,
      prismaOrder.paymentGateway as PaymentGateway,
      Number(prismaOrder.amount),
      null, // couponCode
      prismaOrder.createdAt,
      prismaOrder.updatedAt
    );
  }

  async findById(id: string): Promise<Order | null> {
    const order = await this.prisma.order.findUnique({
      where: { id },
    });
    if (!order) return null;
    return this.mapToOrder(order);
  }

  async createOrder(
    userId: string,
    courses: any[],
    couponCode?: string
  ): Promise<Order> {
    const totalAmount = courses.reduce(
      (sum, course) => sum + (course.offer || course.price),
      0
    );

    const order = await this.prisma.order.create({
      data: {
        id: uuidv4(),
        userId,
        orderStatus: "PENDING",
        paymentStatus: "PENDING",
        paymentId: null,
        paymentGateway: null,
        amount: totalAmount,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    return this.mapToOrder(order);
  }

  async updateOrderStatus(
    orderId: string,
    status: string,
    paymentIntentId: string,
    paymentGateway: 'STRIPE' | 'RAZORPAY' | null
  ): Promise<Order> {
    const order = await this.prisma.order.update({
      where: { id: orderId },
      data: {
        paymentStatus: "COMPLETED",
        paymentId: paymentIntentId,
        paymentGateway,
        updatedAt: new Date(),
      },
    });

    return this.mapToOrder(order);
  }
} 