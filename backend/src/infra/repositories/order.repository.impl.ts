import { PrismaClient, Order as PrismaOrder, OrderItem as PrismaOrderItem, Course as PrismaCourse } from "@prisma/client";
import { IOrderRepository } from "../../app/repositories/order.repository";
import { Order } from "../../domain/entities/order.entity";
import { Course } from "../../domain/entities/course.entity";
import { OrderStatus } from "../../domain/enum/order-status.enum";
import { PaymentStatus } from "../../domain/enum/payment-status.enum";
import { PaymentGateway } from "../../domain/enum/payment-gateway.enum";
import { OrderFilters, PaginatedOrderResult, OrderItemCreation, CourseOrderData } from "../../domain/types/order.interface";

export class OrderRepository implements IOrderRepository {
  constructor(private _prisma: PrismaClient) {}

  async findAll(
    userId: string,
    filters: OrderFilters
  ): Promise<PaginatedOrderResult> {
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
      this._prisma.order.findMany({
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
      this._prisma.order.count({ where }),
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

  private mapToOrderEntity(order: Record<string, unknown>): Order {
    const mappedOrder = new Order(
      order.userId as string,
      order.orderStatus as OrderStatus,
      order.paymentStatus as PaymentStatus,
      order.paymentId as string | null,
      order.paymentGateway as PaymentGateway,
      typeof order.amount === 'number' ? order.amount : (order.amount as { toNumber(): number }).toNumber(),
      order.couponCode as string | null,
      (order.items as Array<Record<string, unknown>>).map((item) => ({
        orderId: item.orderId as string,
        courseId: item.courseId as string,
        courseTitle: (item.courseTitle as string) || (item.course as Record<string, unknown>)?.title as string || "Unknown Course",
        coursePrice: typeof item.coursePrice === 'number' ? item.coursePrice : (item.coursePrice as { toNumber(): number }).toNumber(),
        discount: item.discount ? (typeof item.discount === 'number' ? item.discount : (item.discount as { toNumber(): number }).toNumber()) : null,
        couponId: item.couponId as string | null,
        title: (item.course as Record<string, unknown>)?.title as string || (item.courseTitle as string) || "Unknown Course",
        description: (item.course as Record<string, unknown>)?.description as string || "No description available",
        level: (item.course as Record<string, unknown>)?.level as string || "BEGINNER",
        price: (item.course as Record<string, unknown>)?.price
          ? (typeof (item.course as Record<string, unknown>).price === 'number' ? (item.course as Record<string, unknown>).price as number : ((item.course as Record<string, unknown>).price as { toNumber(): number }).toNumber())
          : (typeof item.coursePrice === 'number' ? item.coursePrice : (item.coursePrice as { toNumber(): number }).toNumber()),
        thumbnail: (item.course as Record<string, unknown>)?.thumbnail as string | null,
        status: (item.course as Record<string, unknown>)?.status as string || "ACTIVE",
        categoryId: (item.course as Record<string, unknown>)?.categoryId as string || "",
        createdBy: (item.course as Record<string, unknown>)?.createdBy as string || "",
        deletedAt: (item.course as Record<string, unknown>)?.deletedAt
          ? new Date((item.course as Record<string, unknown>).deletedAt as Date).toISOString()
          : null,
        approvalStatus: (item.course as Record<string, unknown>)?.approvalStatus as string || "PENDING",
        details: (item.course as Record<string, unknown>)?.details ? {
          prerequisites: ((item.course as Record<string, unknown>)?.details as Record<string, unknown>)?.prerequisites as string | null || null,
          longDescription: ((item.course as Record<string, unknown>)?.details as Record<string, unknown>)?.longDescription as string | null || null,
          objectives: ((item.course as Record<string, unknown>)?.details as Record<string, unknown>)?.objectives as string | null || null,
          targetAudience: ((item.course as Record<string, unknown>)?.details as Record<string, unknown>)?.targetAudience as string | null || null,
        } : null,
      }))
    );
    mappedOrder.id = order.id as string;
    mappedOrder.createdAt = order.createdAt as Date;
    mappedOrder.updatedAt = order.updatedAt as Date;
    return mappedOrder;
  }

  async findById(id: string): Promise<Order | null> {
    const order = await this._prisma.order.findUnique({
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
    const orders = await this._prisma.order.findMany({
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
    courses: CourseOrderData[],
    paymentMethod: PaymentGateway,
    couponCode?: string
  ): Promise<Order> {
    const totalAmount = courses.reduce(
      (sum, course) => sum + (course.offer || course.price),
      0
    );

    // Create order with items in a transaction
    const order = await this._prisma.$transaction(async (prisma) => {
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
    await this._prisma.order.update({
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
    skip: number;
    take: number;
    orderBy: Record<string, 'asc' | 'desc' | undefined>;
    include?: Record<string, unknown>;
  }): Promise<Order[]> {
    const orders = await this._prisma.order.findMany(params);
    return orders.map((order) => this.mapToOrderEntity(order));
  }

  async count(where: Record<string, unknown>): Promise<number> {
    return this._prisma.order.count({ where });
  }

  async create(order: Order): Promise<Order> {
    const createdOrder = await this._prisma.order.create({
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
    const updatedOrder = await this._prisma.order.update({
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
    await this._prisma.order.delete({
      where: { id },
    });
  }

  async findByPaymentId(paymentId: string): Promise<Order | null> {
    const order = await this._prisma.order.findFirst({
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
    courses: CourseOrderData[]
  ): Promise<OrderItemCreation[]> {
    const orderItems = await Promise.all(
      courses.map(async (course) => {
        const orderItem = await this._prisma.orderItem.create({
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
  ): Promise<OrderItemCreation[]> {
    const orderItems = await this._prisma.orderItem.findMany({
      where: { orderId },
      include: {
        course: true,
      },
    });
    return orderItems.map((item) => ({
      id: item.id,
      orderId: item.orderId,
      courseId: item.courseId,
    }));
  }

  async findCourseById(courseId: string): Promise<Course | null> {
    const course = await this._prisma.course.findUnique({
      where: { id: courseId },
    });
    return course ? Course.fromPersistence(course) : null;
  }
}
