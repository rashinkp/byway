import { StatusCodes } from "http-status-codes";
import { AppError } from "../../utils/appError";
import { logger } from "../../utils/logger";
import { UserService } from "../user/user.service";
import { ITransactionHistoryRepository } from "./transaction.repository.interface";
import { ITransaction } from "./transaction.types";
import { OrderService } from "../order/order.service";

export class TransactionHistoryService {
  constructor(
    private transactionHistoryRepository: ITransactionHistoryRepository,
    private paymentService: OrderService,
    private userService: UserService
  ) {}

  async createTransaction(data: {
    orderId: string;
    userId: string;
    courseId: string | null;
    amount: number;
    type: "PAYMENT" | "REFUND";
    status: "PENDING" | "COMPLETED" | "FAILED";
    paymentGateway: "STRIPE" | "PAYPAL" | "RAZORPAY" | null;
    transactionId: string | null;
  }): Promise<ITransaction> {
    try {
      const order = await this.paymentService.findOrderById(data.orderId);
      if (!order) {
        throw new AppError(
          "Order not found",
          StatusCodes.NOT_FOUND,
          "NOT_FOUND"
        );
      }
      if (order.userId !== data.userId) {
        throw new AppError(
          "User does not own this order",
          StatusCodes.FORBIDDEN,
          "FORBIDDEN"
        );
      }
      if (data.courseId) {
        const orderItem = order.items.find(
          (item) => item.courseId === data.courseId
        );
        if (!orderItem) {
          throw new AppError(
            "Course not found in order",
            StatusCodes.BAD_REQUEST,
            "BAD_REQUEST"
          );
        }
      }
      if (data.amount <= 0) {
        throw new AppError(
          "Amount must be positive",
          StatusCodes.BAD_REQUEST,
          "BAD_REQUEST"
        );
      }

      const transaction =
        await this.transactionHistoryRepository.createTransaction(data);
      return transaction;
    } catch (error) {
      logger.error("Create transaction error:", { error, data });
      throw error instanceof AppError
        ? error
        : new AppError(
            "Failed to create transaction",
            StatusCodes.INTERNAL_SERVER_ERROR,
            "INTERNAL_ERROR"
          );
    }
  }

  async getTransactionById(
    transactionId: string,
    requestingUser: { id: string; role: string }
  ): Promise<ITransaction> {
    try {
      const transaction =
        await this.transactionHistoryRepository.findTransactionById(
          transactionId
        );
      if (!transaction) {
        throw new AppError(
          "Transaction not found",
          StatusCodes.NOT_FOUND,
          "NOT_FOUND"
        );
      }
      if (
        requestingUser.role !== "ADMIN" &&
        transaction.userId !== requestingUser.id
      ) {
        throw new AppError(
          "Unauthorized to access this transaction",
          StatusCodes.FORBIDDEN,
          "FORBIDDEN"
        );
      }
      return transaction;
    } catch (error) {
      logger.error("Get transaction error:", { error, transactionId });
      throw error instanceof AppError
        ? error
        : new AppError(
            "Failed to retrieve transaction",
            StatusCodes.INTERNAL_SERVER_ERROR,
            "INTERNAL_ERROR"
          );
    }
  }

  async getTransactionsByOrderId(
    orderId: string,
    requestingUser: { id: string; role: string }
  ): Promise<ITransaction[]> {
    try {
      const order = await this.paymentService.findOrderById(orderId);
      if (!order) {
        throw new AppError(
          "Order not found",
          StatusCodes.NOT_FOUND,
          "NOT_FOUND"
        );
      }
      if (
        requestingUser.role !== "ADMIN" &&
        order.userId !== requestingUser.id
      ) {
        throw new AppError(
          "Unauthorized to access this order's transactions",
          StatusCodes.FORBIDDEN,
          "FORBIDDEN"
        );
      }
      const transactions =
        await this.transactionHistoryRepository.findTransactionsByOrderId(
          orderId
        );
      return transactions;
    } catch (error) {
      logger.error("Get transactions by order error:", { error, orderId });
      throw error instanceof AppError
        ? error
        : new AppError(
            "Failed to retrieve transactions",
            StatusCodes.INTERNAL_SERVER_ERROR,
            "INTERNAL_ERROR"
          );
    }
  }

  async getTransactionsByUserId(
    userId: string,
    requestingUser: { id: string; role: string }
  ): Promise<ITransaction[]> {
    try {
      const user = await this.userService.findUserById(userId);
      if (!user || user.deletedAt) {
        throw new AppError(
          "User not found or deactivated",
          StatusCodes.NOT_FOUND,
          "NOT_FOUND"
        );
      }
      if (requestingUser.role !== "ADMIN" && requestingUser.id !== userId) {
        throw new AppError(
          "Unauthorized to access this user's transactions",
          StatusCodes.FORBIDDEN,
          "FORBIDDEN"
        );
      }
      const transactions =
        await this.transactionHistoryRepository.findTransactionsByUserId(
          userId
        );
      return transactions;
    } catch (error) {
      logger.error("Get transactions by user error:", { error, userId });
      throw error instanceof AppError
        ? error
        : new AppError(
            "Failed to retrieve transactions",
            StatusCodes.INTERNAL_SERVER_ERROR,
            "INTERNAL_ERROR"
          );
    }
  }

  async updateTransactionStatus(data: {
    transactionId: string;
    status: "PENDING" | "COMPLETED" | "FAILED";
    paymentGateway?: "STRIPE" | "PAYPAL" | "RAZORPAY" | null;
  }): Promise<ITransaction> {
    try {
      const transaction =
        await this.transactionHistoryRepository.findTransactionById(
          data.transactionId
        );
      if (!transaction) {
        throw new AppError(
          "Transaction not found",
          StatusCodes.NOT_FOUND,
          "NOT_FOUND"
        );
      }
      const updatedTransaction =
        await this.transactionHistoryRepository.updateTransactionStatus(
          data.transactionId,
          data.status,
          data.paymentGateway
        );
      return updatedTransaction;
    } catch (error) {
      logger.error("Update transaction status error:", { error, data });
      throw error instanceof AppError
        ? error
        : new AppError(
            "Failed to update transaction status",
            StatusCodes.INTERNAL_SERVER_ERROR,
            "INTERNAL_ERROR"
          );
    }
  }
}
