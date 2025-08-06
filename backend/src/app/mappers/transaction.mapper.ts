import { Transaction } from "../../domain/entities/transaction.entity";
import { Order } from "../../domain/entities/order.entity";
import { Course } from "../../domain/entities/course.entity";
import { Wallet } from "../../domain/entities/wallet.entity";
import {
  GetAllTransactionsRequestDto,
  GetTransactionByIdRequestDto,
  GetUserTransactionsRequestDto,
  CreateTransactionRequestDto,
  UpdateTransactionStatusRequestDto,
  TransactionResponseDto,
  TransactionsListResponseDto,
  TransactionSummaryResponseDto,
} from "../dtos/transaction.dto";

export class TransactionMapper {
  // Domain Entity to Response DTOs
  static toTransactionResponseDto(
    transaction: Transaction,
    additionalData?: {
      order?: Order;
      course?: Course;
      wallet?: Wallet;
    }
  ): TransactionResponseDto {
    const response: TransactionResponseDto = {
      id: transaction.id,
      userId: transaction.userId,
      walletId: transaction.walletId,
      amount: transaction.amount,
      currency: transaction.currency,
      type: transaction.type,
      status: transaction.status,
      description: transaction.description,
      transactionId: transaction.transactionId,
      paymentGateway: transaction.paymentGateway,
      orderId: transaction.orderId,
      courseId: transaction.courseId,
      metadata: transaction.metadata,
      isCompleted: transaction.isCompleted(),
      isPending: transaction.isPending(),
      isFailed: transaction.isFailed(),
      isRefunded: transaction.isRefunded(),
      isCancelled: transaction.isCancelled(),
      isPayment: transaction.isPayment(),
      isRefund: transaction.isRefund(),
      hasOrder: transaction.hasOrder(),
      hasCourse: transaction.hasCourse(),
      hasWallet: transaction.hasWallet(),
      hasTransactionId: transaction.hasTransactionId(),
      createdAt: transaction.createdAt,
      updatedAt: transaction.updatedAt,
    };

    if (additionalData?.order) {
      response.order = {
        id: additionalData.order.id,
        userId: additionalData.order.userId,
        subtotal: additionalData.order.subtotal,
        total: additionalData.order.total,
        paymentStatus: additionalData.order.paymentStatus,
        orderStatus: additionalData.order.orderStatus,
        createdAt: additionalData.order.createdAt,
        updatedAt: additionalData.order.updatedAt,
      };
    }

    if (additionalData?.course) {
      response.course = {
        id: additionalData.course.id,
        title: additionalData.course.title,
        price: additionalData.course.price,
        thumbnail: additionalData.course.thumbnail,
      };
    }

    if (additionalData?.wallet) {
      response.wallet = {
        id: additionalData.wallet.id,
        balance: additionalData.wallet.getBalanceAmount(),
        currency: additionalData.wallet.getBalanceCurrency(),
      };
    }

    return response;
  }

  static toTransactionsListResponseDto(
    transactions: TransactionResponseDto[],
    pagination: {
      total: number;
      totalPages: number;
    }
  ): TransactionsListResponseDto {
    return {
      transactions,
      total: pagination.total,
      totalPages: pagination.totalPages,
    };
  }

  static toTransactionSummaryResponseDto(
    totalTransactions: number,
    totalAmount: number,
    completedTransactions: number,
    pendingTransactions: number,
    failedTransactions: number,
    refundedTransactions: number,
    cancelledTransactions: number,
    paymentTransactions: number,
    refundTransactions: number
  ): TransactionSummaryResponseDto {
    return {
      totalTransactions,
      totalAmount,
      completedTransactions,
      pendingTransactions,
      failedTransactions,
      refundedTransactions,
      cancelledTransactions,
      paymentTransactions,
      refundTransactions,
    };
  }
}