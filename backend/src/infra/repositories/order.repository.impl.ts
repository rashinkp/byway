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
      include: {
        items: true,
      },
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

    // Create order with items in a transaction
    const order = await this.prisma.$transaction(async (prisma) => {
      // Create the order
      const newOrder = await prisma.order.create({
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

      // Create order items for each course
      const orderItems = await Promise.all(
        courses.map((course) =>
          prisma.orderItem.create({
            data: {
              id: uuidv4(),
              orderId: newOrder.id,
              courseId: course.id,
              coursePrice: course.offer || course.price,
              courseTitle: course.title,
              discount: course.offer ? course.price - course.offer : null,
              couponId: couponCode || null,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          })
        )
      );

      return {
        ...newOrder,
        items: orderItems,
      };
    });

    return this.mapToOrder(order);
  }

  async updateOrderStatus(
    orderId: string,
    status: string,
    paymentIntentId: string,
    paymentGateway: "STRIPE" | "RAZORPAY" | null
  ): Promise<Order> {
    const order = await this.prisma.order.update({
      where: { id: orderId },
      data: {
        paymentStatus: "COMPLETED",
        paymentId: paymentIntentId,
        paymentGateway,
        updatedAt: new Date(),
      },
      include: {
        items: true,
      },
    });

    return this.mapToOrder(order);
  }
}
