import { PrismaClient } from "@prisma/client";
import { IOrderRepository } from "../../app/repositories/order.repository";
import { Order } from "../../domain/entities/order.entity";
import { Course } from "../../domain/entities/course.entity";
import { v4 as uuidv4 } from "uuid";
import { OrderStatus } from "../../domain/enum/order-status.enum";
import { PaymentStatus } from "../../domain/enum/payment-status.enum";
import { PaymentGateway } from "../../domain/enum/payment-gateway.enum";
import { GetAllOrdersDto } from "../../app/dtos/order.dto";

export class OrderRepository implements IOrderRepository {
  constructor(private prisma: PrismaClient) {}

  async findAll(
    userId: string,
    filters: GetAllOrdersDto
  ): Promise<{
    orders: Order[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const {
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = filters;

    const where = {
      userId,
      ...(filters.status && filters.status !== "ALL"
        ? {
            orderStatus: filters.status as
              | "PENDING"
              | "CONFIRMED"
              | "CANCELLED",
          }
        : {}),
      ...(filters.startDate && filters.endDate
        ? {
            createdAt: {
              gte: new Date(filters.startDate),
              lte: new Date(filters.endDate),
            },
          }
        : {}),
      ...(filters.minAmount && filters.maxAmount
        ? {
            amount: {
              gte: filters.minAmount,
              lte: filters.maxAmount,
            },
          }
        : {}),
    } as const;

    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          items: {
            include: {
              course: true,
            },
          },
        },
      }),
      this.prisma.order.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      orders: orders.map((order) => this.mapToOrderEntity(order)),
      total,
      page,
      limit,
      totalPages,
    };
  }

  private mapToOrderEntity(order: any): Order {
    const mappedOrder = new Order(
      order.userId,
      order.orderStatus as OrderStatus,
      order.paymentStatus as PaymentStatus,
      order.paymentId,
      order.paymentGateway as PaymentGateway,
      Number(order.amount),
      order.couponCode,
      order.items.map((item: any) => ({
        orderId: item.orderId,
        courseId: item.courseId,
        courseTitle: item.courseTitle || item.course?.title || "Unknown Course",
        coursePrice: Number(item.coursePrice),
        discount: item.discount ? Number(item.discount) : null,
        couponId: item.couponId,
        title: item.course?.title || item.courseTitle || "Unknown Course",
        description: item.course?.description || "No description available",
        level: item.course?.level || "BEGINNER",
        price: item.course?.price
          ? Number(item.course.price)
          : Number(item.coursePrice),
        thumbnail: item.course?.thumbnail || null,
        status: item.course?.status || "ACTIVE",
        categoryId: item.course?.categoryId || "",
        createdBy: item.course?.createdBy || "",
        deletedAt: item.course?.deletedAt
          ? new Date(item.course.deletedAt).toISOString()
          : null,
        approvalStatus: item.course?.approvalStatus || "PENDING",
        details: item.course?.details || null,
      }))
    );
    mappedOrder.id = order.id;
    mappedOrder.createdAt = order.createdAt;
    mappedOrder.updatedAt = order.updatedAt;
    return mappedOrder;
  }

  async findById(id: string): Promise<Order | null> {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            course: true,
          },
        },
      },
    });

    return order ? this.mapToOrderEntity(order) : null;
  }

  async getAllOrders(userId: string): Promise<Order[]> {
    const orders = await this.prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            course: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return orders.map((order) => this.mapToOrderEntity(order));
  }

  async createOrder(
    userId: string,
    courses: any[],
    paymentMethod: PaymentGateway,
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
          userId,
          orderStatus: "PENDING",
          paymentStatus: "PENDING",
          paymentId: null,
          paymentGateway: paymentMethod,
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
              orderId: newOrder.id,
              courseId: course.id,
              coursePrice: course.offer || course.price,
              courseTitle: course.title,
              discount: course.offer ? course.price - course.offer : null,
              couponId: couponCode || null,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            include: {
              course: true,
            },
          })
        )
      );

      return {
        ...newOrder,
        items: orderItems,
      };
    });

    return this.mapToOrderEntity(order);
  }

  async updateOrderStatus(
    orderId: string,
    status: OrderStatus,
    paymentId: string,
    paymentGateway: PaymentGateway
  ): Promise<void> {
    const paymentStatus = this.mapOrderStatusToPaymentStatus(status);
    await this.prisma.order.update({
      where: { id: orderId },
      data: {
        orderStatus: status,
        paymentStatus,
        paymentId,
        paymentGateway,
        updatedAt: new Date(),
      },
    });
  }

  private mapOrderStatusToPaymentStatus(
    orderStatus: OrderStatus
  ): PaymentStatus {
    switch (orderStatus) {
      case OrderStatus.COMPLETED:
        return PaymentStatus.COMPLETED;
      case OrderStatus.FAILED:
        return PaymentStatus.FAILED;
      case OrderStatus.REFUNDED:
        return PaymentStatus.REFUNDED;
      default:
        return PaymentStatus.PENDING;
    }
  }

  async findMany(params: {
    where: any;
    skip: number;
    take: number;
    orderBy: any;
    include?: any;
  }): Promise<Order[]> {
    const orders = await this.prisma.order.findMany(params);
    return orders.map((order) => this.mapToOrderEntity(order));
  }

  async count(where: any): Promise<number> {
    return this.prisma.order.count({ where });
  }

  async create(order: Order): Promise<Order> {
    const createdOrder = await this.prisma.order.create({
      data: {
        userId: order.userId,
        orderStatus: order.status as "PENDING" | "CONFIRMED" | "CANCELLED",
        paymentStatus: order.paymentStatus,
        paymentId: order.paymentIntentId,
        paymentGateway: order.paymentGateway,
        amount: order.totalAmount,
        items: {
          create: order.items.map((item) => ({
            courseId: item.courseId,
            courseTitle: item.courseTitle,
            coursePrice: item.coursePrice,
            discount: item.discount,
            couponId: item.couponId,
          })),
        },
      },
      include: {
        items: {
          include: {
            course: true,
          },
        },
      },
    });

    const mappedOrder = this.mapToOrderEntity(createdOrder);
    order.id = mappedOrder.id;
    return order;
  }

  async update(order: Order): Promise<Order> {
    const updatedOrder = await this.prisma.order.update({
      where: { id: order.id },
      data: {
        orderStatus: order.status as "PENDING" | "CONFIRMED" | "CANCELLED",
        paymentStatus: order.paymentStatus,
        paymentId: order.paymentIntentId,
        paymentGateway: order.paymentGateway,
        amount: order.totalAmount,
      },
      include: {
        items: {
          include: {
            course: true,
          },
        },
      },
    });

    return this.mapToOrderEntity(updatedOrder);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.order.delete({
      where: { id },
    });
  }

  async findByPaymentId(paymentId: string): Promise<Order | null> {
    const order = await this.prisma.order.findFirst({
      where: { paymentId },
      include: {
        items: {
          include: {
            course: true,
          },
        },
      },
    });

    return order ? this.mapToOrderEntity(order) : null;
  }

  async createOrderItems(
    orderId: string,
    courses: any[]
  ): Promise<{ id: string; orderId: string; courseId: string }[]> {
    const orderItems = await Promise.all(
      courses.map(async (course) => {
        const orderItem = await this.prisma.orderItem.create({
          data: {
            orderId,
            courseId: course.id,
            coursePrice: course.offer ?? course.price ?? 0,
            courseTitle: course.title,
          },
        });
        return {
          id: orderItem.id,
          orderId: orderItem.orderId,
          courseId: orderItem.courseId,
        };
      })
    );
    return orderItems;
  }

  async findOrderItems(
    orderId: string
  ): Promise<
    { id: string; orderId: string; courseId: string; coursePrice: number }[]
  > {
    const orderItems = await this.prisma.orderItem.findMany({
      where: { orderId },
      include: {
        course: true,
      },
    });
    return orderItems.map((item) => ({
      id: item.id,
      orderId: item.orderId,
      courseId: item.courseId,
      coursePrice: Number(item.coursePrice),
    }));
  }

  async findCourseById(courseId: string): Promise<Course | null> {
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
    });
    return course ? Course.fromPrisma(course) : null;
  }
}
