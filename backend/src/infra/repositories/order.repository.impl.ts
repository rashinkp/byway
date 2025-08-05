import { PrismaClient, Prisma } from "@prisma/client";
import { OrderRecord } from "../../app/records/order.record";
import { OrderItemRecord } from "../../app/records/order-item.record";
import { CourseRecord } from "../../app/records/course.record";
import { IOrderRepository } from "../../app/repositories/order.repository";

export class OrderRepository implements IOrderRepository {
  constructor(private prisma: PrismaClient) {}

  async findAll(options: {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    userId?: string;
    status?: string;
    search?: string;
  }): Promise<{ orders: OrderRecord[]; total: number; totalPages: number }> {
    try {
      const {
        page = 1,
        limit = 10,
        sortBy = "createdAt",
        sortOrder = "desc",
        userId,
        status,
        search,
      } = options;

      const skip = (page - 1) * limit;
      const where: Prisma.OrderWhereInput = {};

      if (userId) {
        where.userId = userId;
      }

      if (status && status !== "ALL") {
        where.orderStatus = status as any;
      }

      if (search) {
        where.OR = [
          { id: { contains: search, mode: "insensitive" } },
          { paymentMethod: { contains: search, mode: "insensitive" } },
        ];
      }

      const [orders, total] = await Promise.all([
        this.prisma.order.findMany({
          where,
          skip,
          take: limit,
          orderBy: { [sortBy]: sortOrder },
        }),
        this.prisma.order.count({ where }),
      ]);

      return {
        orders: orders.map(order => this.mapToOrderRecord(order)),
        total,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      throw new Error(`Failed to find all orders: ${error}`);
    }
  }

  async createOrder(order: OrderRecord, items: OrderItemRecord[]): Promise<OrderRecord> {
    try {
      const created = await this.prisma.order.create({
        data: {
          id: order.id,
          userId: order.userId,
          totalAmount: order.totalAmount,
          paymentStatus: order.paymentStatus as any,
          orderStatus: order.orderStatus as any,
          paymentMethod: order.paymentMethod,
          createdAt: order.createdAt,
          updatedAt: order.updatedAt,
          items: {
            create: items.map(item => ({
              id: item.id,
              orderId: item.orderId,
              courseId: item.courseId,
              coursePrice: item.coursePrice,
              adminSharePercentage: item.adminSharePercentage,
              createdAt: item.createdAt,
              updatedAt: item.updatedAt,
            })),
          },
        },
      });

      return this.mapToOrderRecord(created);
    } catch (error) {
      throw new Error(`Failed to create order: ${error}`);
    }
  }

  async findMany(options: {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    userId?: string;
    status?: string;
  }): Promise<{ orders: OrderRecord[]; total: number; totalPages: number }> {
    try {
      const {
        page = 1,
        limit = 10,
        sortBy = "createdAt",
        sortOrder = "desc",
        userId,
        status,
      } = options;

      const skip = (page - 1) * limit;
      const where: Prisma.OrderWhereInput = {};

      if (userId) {
        where.userId = userId;
      }

      if (status) {
        where.orderStatus = status as any;
      }

      const [orders, total] = await Promise.all([
        this.prisma.order.findMany({
          where,
          skip,
          take: limit,
          orderBy: { [sortBy]: sortOrder },
        }),
        this.prisma.order.count({ where }),
      ]);

      return {
        orders: orders.map(order => this.mapToOrderRecord(order)),
        total,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      throw new Error(`Failed to find many orders: ${error}`);
    }
  }

  async create(order: OrderRecord): Promise<OrderRecord> {
    try {
      const created = await this.prisma.order.create({
        data: {
          id: order.id,
          userId: order.userId,
          totalAmount: order.totalAmount,
          paymentStatus: order.paymentStatus as any,
          orderStatus: order.orderStatus as any,
          paymentMethod: order.paymentMethod,
          createdAt: order.createdAt,
          updatedAt: order.updatedAt,
        },
      });

      return this.mapToOrderRecord(created);
    } catch (error) {
      throw new Error(`Failed to create order: ${error}`);
    }
  }

  async update(order: OrderRecord): Promise<OrderRecord> {
    try {
      const updated = await this.prisma.order.update({
        where: { id: order.id },
        data: {
          userId: order.userId,
          totalAmount: order.totalAmount,
          paymentStatus: order.paymentStatus as any,
          orderStatus: order.orderStatus as any,
          paymentMethod: order.paymentMethod,
          updatedAt: order.updatedAt,
        },
      });

      return this.mapToOrderRecord(updated);
    } catch (error) {
      throw new Error(`Failed to update order: ${error}`);
    }
  }

  async findOrderItems(orderId: string): Promise<OrderItemRecord[]> {
    try {
      const items = await this.prisma.orderItem.findMany({
        where: { orderId },
      });

      return items.map(item => this.mapToOrderItemRecord(item));
    } catch (error) {
      throw new Error(`Failed to find order items: ${error}`);
    }
  }

  async findCourseById(courseId: string): Promise<CourseRecord | null> {
    try {
      const course = await this.prisma.course.findUnique({
        where: { id: courseId },
      });

      return course ? this.mapToCourseRecord(course) : null;
    } catch (error) {
      throw new Error(`Failed to find course by id: ${error}`);
    }
  }

  private mapToOrderRecord(prismaOrder: any): OrderRecord {
    return {
      id: prismaOrder.id,
      userId: prismaOrder.userId,
      totalAmount: Number(prismaOrder.totalAmount),
      paymentStatus: prismaOrder.paymentStatus,
      orderStatus: prismaOrder.orderStatus,
      paymentMethod: prismaOrder.paymentMethod,
      createdAt: prismaOrder.createdAt,
      updatedAt: prismaOrder.updatedAt,
    };
  }

  private mapToOrderItemRecord(prismaItem: any): OrderItemRecord {
    return {
      id: prismaItem.id,
      orderId: prismaItem.orderId,
      courseId: prismaItem.courseId,
      coursePrice: Number(prismaItem.coursePrice),
      adminSharePercentage: Number(prismaItem.adminSharePercentage),
      createdAt: prismaItem.createdAt,
      updatedAt: prismaItem.updatedAt,
    };
  }

  private mapToCourseRecord(prismaCourse: any): CourseRecord {
    return {
      id: prismaCourse.id,
      title: prismaCourse.title,
      description: prismaCourse.description,
      level: prismaCourse.level,
      price: prismaCourse.price ? Number(prismaCourse.price) : null,
      thumbnail: prismaCourse.thumbnail,
      duration: prismaCourse.duration,
      offer: prismaCourse.offer ? Number(prismaCourse.offer) : null,
      status: prismaCourse.status,
      categoryId: prismaCourse.categoryId,
      createdBy: prismaCourse.createdBy,
      createdAt: prismaCourse.createdAt,
      updatedAt: prismaCourse.updatedAt,
      deletedAt: prismaCourse.deletedAt,
      approvalStatus: prismaCourse.approvalStatus,
      adminSharePercentage: Number(prismaCourse.adminSharePercentage),
    };
  }
}
