import { OrderService } from "./order.service";
import { StatusCodes } from "http-status-codes";
import { ApiResponse } from "../../types/response";
import { z } from "zod";
import { AppError } from "../../utils/appError";
import { logger } from "../../utils/logger";
import { CreateOrderSchema, UpdateOrderStatusSchema } from "./order.validators";

export class OrderController {
  constructor(private orderService: OrderService) {}

  async createOrder(input: unknown): Promise<ApiResponse> {
    try {
      const validatedInput = CreateOrderSchema.parse(input);
      const { userId, courses, couponCode } = validatedInput;
      const order = await this.orderService.createOrder(
        userId,
        courses,
        couponCode
      );
      return {
        status: "success",
        data: {
          id: order.id,
          userId: order.userId,
          amount: order.amount,
          paymentStatus: order.paymentStatus,
          orderStatus: order.orderStatus,
          createdAt: order.createdAt,
          items: order.items.map((item) => ({
            id: item.id,
            courseId: item.courseId,
            courseTitle: item.courseTitle,
            coursePrice: item.coursePrice,
            discount: item.discount,
            couponId: item.couponId,
          })),
        },
        statusCode: StatusCodes.CREATED,
        message: "Order created successfully",
      };
    } catch (error) {
      logger.error("Create order error:", { error, input });
      if (error instanceof z.ZodError) {
        throw AppError.badRequest("Validation failed: " + error.message);
      }
      throw error;
    }
  }

  async updateOrderStatus(input: unknown): Promise<ApiResponse> {
    try {
      const validatedInput = UpdateOrderStatusSchema.parse(input);
      const { orderId, paymentStatus, paymentId, paymentGateway } =
        validatedInput;
      const order = await this.orderService.updateOrderStatus(
        orderId,
        paymentStatus,
        paymentId,
        paymentGateway
      );
      return {
        status: "success",
        data: {
          id: order.id,
          paymentStatus: order.paymentStatus,
          orderStatus: order.orderStatus,
          items: order.items.map((item) => ({
            id: item.id,
            courseId: item.courseId,
            courseTitle: item.courseTitle,
            coursePrice: item.coursePrice,
            discount: item.discount,
            couponId: item.couponId,
          })),
        },
        statusCode: StatusCodes.OK,
        message: "Order status updated successfully",
      };
    } catch (error) {
      logger.error("Update order status error:", { error, input });
      if (error instanceof z.ZodError) {
        throw AppError.badRequest("Validation failed: " + error.message);
      }
      throw error;
    }
  }
}
