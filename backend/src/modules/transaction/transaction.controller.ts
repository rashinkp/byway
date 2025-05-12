import { StatusCodes } from "http-status-codes";
import { ApiResponse } from "../../types/response";
import { z } from "zod";
import { AppError } from "../../utils/appError";
import { logger } from "../../utils/logger";
import { TransactionHistoryService } from "./transaction.service";
import { CreateTransactionSchema, GetTransactionsByOrderSchema, GetTransactionsByUserSchema, UpdateTransactionStatusSchema } from "./transaction.validators";

export class TransactionHistoryController {
  constructor(private transactionHistoryService: TransactionHistoryService) {}

  async createTransaction(
    input: unknown,
    requestingUser: { id: string; role: string }
  ): Promise<ApiResponse> {
    try {
      if (requestingUser.role !== "ADMIN") {
        throw new AppError(
          "Only admins can create transactions",
          StatusCodes.FORBIDDEN,
          "FORBIDDEN"
        );
      }
      const validatedInput = CreateTransactionSchema.parse(input);
      const transaction =
        await this.transactionHistoryService.createTransaction(validatedInput);
      return {
        status: "success",
        data: {
          id: transaction.id,
          orderId: transaction.orderId,
          userId: transaction.userId,
          courseId: transaction.courseId,
          amount: transaction.amount,
          type: transaction.type,
          status: transaction.status,
          paymentGateway: transaction.paymentGateway,
          transactionId: transaction.transactionId,
          createdAt: transaction.createdAt,
        },
        statusCode: StatusCodes.CREATED,
        message: "Transaction created successfully",
      };
    } catch (error) {
      logger.error("Create transaction error:", { error, input });
      if (error instanceof z.ZodError) {
        throw AppError.badRequest("Validation failed: " + error.message);
      }
      throw error;
    }
  }

  async getTransactionById(
    input: unknown,
    requestingUser: { id: string; role: string }
  ): Promise<ApiResponse> {
    try {
      const validatedInput = z
        .object({ transactionId: z.string().uuid("Invalid transaction ID") })
        .parse(input);
      const transaction =
        await this.transactionHistoryService.getTransactionById(
          validatedInput.transactionId,
          requestingUser
        );
      return {
        status: "success",
        data: {
          id: transaction.id,
          orderId: transaction.orderId,
          userId: transaction.userId,
          courseId: transaction.courseId,
          amount: transaction.amount,
          type: transaction.type,
          status: transaction.status,
          paymentGateway: transaction.paymentGateway,
          transactionId: transaction.transactionId,
          createdAt: transaction.createdAt,
        },
        statusCode: StatusCodes.OK,
        message: "Transaction retrieved successfully",
      };
    } catch (error) {
      logger.error("Get transaction error:", { error, input });
      if (error instanceof z.ZodError) {
        throw AppError.badRequest("Validation failed: " + error.message);
      }
      throw error;
    }
  }

  async getTransactionsByOrder(
    input: unknown,
    requestingUser: { id: string; role: string }
  ): Promise<ApiResponse> {
    try {
      const validatedInput = GetTransactionsByOrderSchema.parse(input);
      const transactions =
        await this.transactionHistoryService.getTransactionsByOrderId(
          validatedInput.orderId,
          requestingUser
        );
      return {
        status: "success",
        data: transactions.map((transaction) => ({
          id: transaction.id,
          orderId: transaction.orderId,
          userId: transaction.userId,
          courseId: transaction.courseId,
          amount: transaction.amount,
          type: transaction.type,
          status: transaction.status,
          paymentGateway: transaction.paymentGateway,
          transactionId: transaction.transactionId,
          createdAt: transaction.createdAt,
        })),
        statusCode: StatusCodes.OK,
        message: "Transactions retrieved successfully",
      };
    } catch (error) {
      logger.error("Get transactions by order error:", { error, input });
      if (error instanceof z.ZodError) {
        throw AppError.badRequest("Validation failed: " + error.message);
      }
      throw error;
    }
  }

  async getTransactionsByUser(
    userId:string
  ): Promise<ApiResponse> {
    try {
      const transactions =
        await this.transactionHistoryService.getTransactionsByUserId(
          userId
        );
      return {
        status: "success",
        data: transactions.map((transaction) => ({
          id: transaction.id,
          orderId: transaction.orderId,
          userId: transaction.userId,
          courseId: transaction.courseId,
          amount: transaction.amount,
          type: transaction.type,
          status: transaction.status,
          paymentGateway: transaction.paymentGateway,
          transactionId: transaction.transactionId,
          createdAt: transaction.createdAt,
        })),
        statusCode: StatusCodes.OK,
        message: "Transactions retrieved successfully",
      };
    } catch (error) {
      logger.error("Get transactions by user error:", { error });
      if (error instanceof z.ZodError) {
        throw AppError.badRequest("Validation failed: " + error.message);
      }
      throw error;
    }
  }

  async updateTransactionStatus(
    input: unknown,
    requestingUser: { id: string; role: string }
  ): Promise<ApiResponse> {
    try {
      if (requestingUser.role !== "ADMIN") {
        throw new AppError(
          "Only admins can update transaction status",
          StatusCodes.FORBIDDEN,
          "FORBIDDEN"
        );
      }
      const validatedInput = UpdateTransactionStatusSchema.parse(input);
      const transaction =
        await this.transactionHistoryService.updateTransactionStatus(
          validatedInput
        );
      return {
        status: "success",
        data: {
          id: transaction.id,
          status: transaction.status,
          paymentGateway: transaction.paymentGateway,
          transactionId: transaction.transactionId,
        },
        statusCode: StatusCodes.OK,
        message: "Transaction status updated successfully",
      };
    } catch (error) {
      logger.error("Update transaction status error:", { error, input });
      if (error instanceof z.ZodError) {
        throw AppError.badRequest("Validation failed: " + error.message);
      }
      throw error;
    }
  }
}
