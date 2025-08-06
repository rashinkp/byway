import { Order } from "../../domain/entities/order.entity";
import { OrderItem } from "../../domain/entities/order-item.entity";
import { Course } from "../../domain/entities/course.entity";
import {
  GetAllOrdersRequestDto,
  GetOrderByIdRequestDto,
  GetUserOrdersRequestDto,
  CreateOrderRequestDto,
  UpdateOrderStatusRequestDto,
  CourseResponseDto,
  OrderItemResponseDto,
  OrderResponseDto,
  OrdersListResponseDto,
  OrderSummaryResponseDto,
} from "../dtos/order.dto";

export class OrderMapper {
  // Domain Entity to Response DTOs
  static toCourseResponseDto(course: Course): CourseResponseDto {
    return {
      id: course.id,
      title: course.title,
      description: course.description,
      level: course.level,
      price: course.price,
      thumbnail: course.thumbnail,
      duration: course.duration,
      offer: course.offer,
      status: course.status,
      categoryId: course.categoryId,
      createdBy: course.createdBy,
      createdAt: course.createdAt,
      updatedAt: course.updatedAt,
      deletedAt: course.deletedAt,
      approvalStatus: course.approvalStatus,
      adminSharePercentage: course.adminSharePercentage,
      instructorSharePercentage: 100 - course.adminSharePercentage,
    };
  }

  static toOrderItemResponseDto(
    orderItem: OrderItem,
    course: Course
  ): OrderItemResponseDto {
    return {
      id: orderItem.id,
      courseId: orderItem.courseId,
      course: this.toCourseResponseDto(course),
      price: orderItem.price,
      finalPrice: orderItem.getFinalPrice(),
      discountAmount: orderItem.getDiscountAmount(),
      couponCode: orderItem.couponCode,
      adminSharePercentage: orderItem.adminSharePercentage,
      createdAt: orderItem.createdAt,
      updatedAt: orderItem.updatedAt,
    };
  }

  static toOrderResponseDto(
    order: Order,
    orderItems: OrderItemResponseDto[]
  ): OrderResponseDto {
    return {
      id: order.id,
      userId: order.userId,
      items: orderItems,
      subtotal: order.subtotal,
      discountAmount: order.discountAmount,
      couponCode: order.couponCode,
      couponDiscount: order.couponDiscount,
      total: order.total,
      paymentStatus: order.paymentStatus,
      orderStatus: order.orderStatus,
      paymentIntentId: order.paymentIntentId,
      paymentGateway: order.paymentGateway,
      itemCount: order.getItemCount(),
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    };
  }

  static toOrdersListResponseDto(
    orders: OrderResponseDto[],
    pagination: {
      total: number;
      totalPages: number;
    }
  ): OrdersListResponseDto {
    return {
      orders,
      total: pagination.total,
      totalPages: pagination.totalPages,
    };
  }

  static toOrderSummaryResponseDto(
    totalOrders: number,
    totalRevenue: number,
    completedOrders: number,
    pendingOrders: number,
    failedOrders: number
  ): OrderSummaryResponseDto {
    return {
      totalOrders,
      totalRevenue,
      completedOrders,
      pendingOrders,
      failedOrders,
    };
  }
}