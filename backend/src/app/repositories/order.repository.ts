import { OrderRecord } from "../records/order.record";
import { OrderItemRecord } from "../records/order-item.record";
import { CourseRecord } from "../records/course.record";

export interface IOrderRepository {
  findAll(options: {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    userId?: string;
    status?: string;
    search?: string;
  }): Promise<{ orders: OrderRecord[]; total: number; totalPages: number }>;
  createOrder(order: OrderRecord, items: OrderItemRecord[]): Promise<OrderRecord>;
  findMany(options: {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    userId?: string;
    status?: string;
  }): Promise<{ orders: OrderRecord[]; total: number; totalPages: number }>;
  create(order: OrderRecord): Promise<OrderRecord>;
  update(order: OrderRecord): Promise<OrderRecord>;
  findOrderItems(orderId: string): Promise<OrderItemRecord[]>;
  findCourseById(courseId: string): Promise<CourseRecord | null>;
}
