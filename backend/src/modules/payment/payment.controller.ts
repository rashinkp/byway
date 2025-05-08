import { PaymentService } from "./payment.service";
import { StatusCodes } from "http-status-codes";
import { ApiResponse } from "../../types/response";
import { z } from "zod";
import { AppError } from "../../utils/appError";
import { logger } from "../../utils/logger";
import {
  CreateOrderSchema,
  UpdateOrderStatusSchema,
} from "./payment.validators";

export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  async createOrder(input: unknown): Promise<ApiResponse> {
    try {
      const validatedInput = CreateOrderSchema.parse(input);
      const { userId, courseIds, couponCode } = validatedInput;
      const order = await this.paymentService.createOrder(
        userId,
        courseIds,
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
      const order = await this.paymentService.updateOrderStatus(
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
