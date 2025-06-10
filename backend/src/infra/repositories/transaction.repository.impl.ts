import {
  PrismaClient,
  TransactionHistory,
  TransactionType as PrismaTransactionType,
  TransactionStatus as PrismaTransactionStatus,
  PaymentGateway as PrismaPaymentGateway,
} from "@prisma/client";
import { ITransactionRepository } from "../../app/repositories/transaction.repository";
import { Transaction } from "../../domain/entities/transaction.entity";
import { TransactionStatus } from "../../domain/enum/transaction-status.enum";
import { PaymentGateway } from "../../domain/enum/payment-gateway.enum";
import { TransactionType } from "../../domain/enum/transaction-type.enum";

export class TransactionRepository implements ITransactionRepository {
  constructor(private prisma: PrismaClient) {}

  private mapToTransaction(prismaTransaction: TransactionHistory): Transaction {
    return new Transaction({
      id: prismaTransaction.id,
      orderId: prismaTransaction.orderId || undefined,
      userId: prismaTransaction.userId,
      amount: Number(prismaTransaction.amount),
      type: this.mapPrismaTransactionType(prismaTransaction.type),
      status: this.mapPrismaTransactionStatus(prismaTransaction.status),
      paymentGateway: this.mapPrismaPaymentGateway(
        prismaTransaction.paymentGateway
      ),
      courseId: prismaTransaction.courseId || undefined,
      transactionId: prismaTransaction.transactionId || undefined,
      walletId: prismaTransaction.walletId || undefined,
      createdAt: prismaTransaction.createdAt,
      updatedAt: prismaTransaction.updatedAt,
    });
  }

  private mapPrismaTransactionType(
    type: PrismaTransactionType
  ): TransactionType {
    switch (type) {
      case "PURCHASE":
        return TransactionType.PURCHASE;
      case "PAYMENT":
        return TransactionType.PAYMENT;
      case "REFUND":
        return TransactionType.REFUND;
      case "WALLET_TOPUP":
        return TransactionType.WALLET_TOPUP;
      case "WALLET_WITHDRAWAL":
        return TransactionType.WALLET_WITHDRAWAL;
      default:
        throw new Error(`Unknown transaction type: ${type}`);
    }
  }

  private mapPrismaTransactionStatus(
    status: PrismaTransactionStatus
  ): TransactionStatus {
    switch (status) {
      case "PENDING":
        return TransactionStatus.PENDING;
      case "COMPLETED":
        return TransactionStatus.COMPLETED;
      case "FAILED":
        return TransactionStatus.FAILED;
      default:
        throw new Error(`Unknown transaction status: ${status}`);
    }
  }

  private mapPrismaPaymentGateway(
    gateway: PrismaPaymentGateway | null
  ): PaymentGateway {
    if (!gateway) {
      throw new Error("Payment gateway is required");
    }
    switch (gateway) {
      case "STRIPE":
        return PaymentGateway.STRIPE;
      case "PAYPAL":
        return PaymentGateway.PAYPAL;
      case "RAZORPAY":
        return PaymentGateway.RAZORPAY;
      case "WALLET":
        return PaymentGateway.WALLET;
      default:
        throw new Error(`Unknown payment gateway: ${gateway}`);
    }
  }

  private mapToPrismaTransactionType(
    type: TransactionType
  ): PrismaTransactionType {
    switch (type) {
      case TransactionType.PURCHASE:
        return "PURCHASE";
      case TransactionType.PAYMENT:
        return "PAYMENT";
      case TransactionType.REFUND:
        return "REFUND";
      case TransactionType.WALLET_TOPUP:
        return "WALLET_TOPUP";
      case TransactionType.WALLET_WITHDRAWAL:
        return "WALLET_WITHDRAWAL";
      default:
        throw new Error(`Unknown transaction type: ${type}`);
    }
  }

  private mapToPrismaTransactionStatus(
    status: TransactionStatus
  ): PrismaTransactionStatus {
    switch (status) {
      case TransactionStatus.PENDING:
        return "PENDING";
      case TransactionStatus.COMPLETED:
        return "COMPLETED";
      case TransactionStatus.FAILED:
        return "FAILED";
      default:
        throw new Error(`Unknown transaction status: ${status}`);
    }
  }

  private mapToPrismaPaymentGateway(
    gateway: PaymentGateway
  ): PrismaPaymentGateway {
    switch (gateway) {
      case PaymentGateway.STRIPE:
        return "STRIPE";
      case PaymentGateway.PAYPAL:
        return "PAYPAL";
      case PaymentGateway.RAZORPAY:
        return "RAZORPAY";
      case PaymentGateway.WALLET:
        return "WALLET";
      default:
        throw new Error(`Unknown payment gateway: ${gateway}`);
    }
  }

  async create(transaction: Transaction): Promise<Transaction> {
    console.log('TransactionRepository.create - Input:', {
      orderId: transaction.orderId,
      userId: transaction.userId,
      amount: transaction.amount,
      type: transaction.type,
      status: transaction.status,
      paymentGateway: transaction.paymentGateway
    });

    try {
      const data: any = {
        id: transaction.id,
        userId: transaction.userId,
        amount: transaction.amount,
        type: this.mapToPrismaTransactionType(transaction.type),
        status: this.mapToPrismaTransactionStatus(transaction.status),
        paymentGateway: this.mapToPrismaPaymentGateway(transaction.paymentGateway),
        paymentMethod: transaction.paymentMethod,
        paymentDetails: transaction.paymentDetails,
        courseId: transaction.courseId,
        transactionId: transaction.transactionId,
        metadata: transaction.metadata
      };

      // Only add orderId if it exists
      if (transaction.orderId) {
        data.orderId = transaction.orderId;
      }

      const created = await this.prisma.transactionHistory.create({
        data
      });

      console.log('TransactionRepository.create - Success:', {
        id: created.id,
        orderId: created.orderId,
        amount: created.amount,
        status: created.status
      });

      return this.mapToTransaction(created);
    } catch (error) {
      console.error('TransactionRepository.create - Error:', error);
      throw error;
    }
  }

  async findById(id: string): Promise<Transaction | null> {
    const transaction = await this.prisma.transactionHistory.findUnique({
      where: { id },
    });
    return transaction ? this.mapToTransaction(transaction) : null;
  }

  async findByOrderId(orderId: string): Promise<Transaction | null> {
    const transaction = await this.prisma.transactionHistory.findFirst({
      where: { orderId },
      orderBy: { createdAt: 'desc' }
    });
    return transaction ? this.mapToTransaction(transaction) : null;
  }

  async findByUserId(
    userId: string,
    page?: number,
    limit?: number
  ): Promise<Transaction[]> {
    const transactions = await this.prisma.transactionHistory.findMany({
      where: { userId },
      skip: page ? (page - 1) * (limit || 10) : undefined,
      take: limit,
      orderBy: { createdAt: "desc" },
    });
    return transactions.map((t) => this.mapToTransaction(t));
  }

  async updateStatus(
    id: string,
    status: TransactionStatus,
    metadata?: Record<string, any>
  ): Promise<Transaction> {
    const updated = await this.prisma.transactionHistory.update({
      where: { id },
      data: {
        status: this.mapToPrismaTransactionStatus(status),
        ...(metadata && { metadata: JSON.stringify(metadata) }),
      },
    });
    return this.mapToTransaction(updated);
  }
}
