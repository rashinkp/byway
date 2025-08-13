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
      type: prismaTransaction.type as TransactionType,
      status: prismaTransaction.status as TransactionStatus,
      paymentGateway: prismaTransaction.paymentGateway as PaymentGateway,
      courseId: prismaTransaction.courseId || undefined,
      transactionId: prismaTransaction.transactionId || undefined,
      walletId: prismaTransaction.walletId || undefined,
      createdAt: prismaTransaction.createdAt,
      updatedAt: prismaTransaction.updatedAt,
    });
  }



  private mapToPrismaTransactionStatus(
    status: TransactionStatus
  ): PrismaTransactionStatus {
    return status as PrismaTransactionStatus;
  }

  async create(transaction: Transaction): Promise<Transaction> {
    try {
      const createdTransaction = await this.prisma.transactionHistory.create({
        data: {
          userId: transaction.userId,
          amount: transaction.amount,
          type: transaction.type as PrismaTransactionType,
          status: transaction.status as PrismaTransactionStatus,
          paymentGateway: transaction.paymentGateway as PrismaPaymentGateway,
          paymentMethod: transaction.paymentMethod,
          paymentDetails: transaction.paymentDetails,
          courseId: transaction.courseId,
          transactionId: transaction.transactionId,
          metadata: transaction.metadata,
          orderId: transaction.orderId,
        },
      });

      return new Transaction({
        id: createdTransaction.id,
        orderId: createdTransaction.orderId || undefined,
        userId: createdTransaction.userId,
        amount: Number(createdTransaction.amount),
        type: createdTransaction.type as TransactionType,
        status: createdTransaction.status as TransactionStatus,
        paymentGateway: createdTransaction.paymentGateway as PaymentGateway,
        courseId: createdTransaction.courseId || undefined,
        transactionId: createdTransaction.transactionId || undefined,
        walletId: createdTransaction.walletId || undefined,
        createdAt: createdTransaction.createdAt,
        updatedAt: createdTransaction.updatedAt,
      });
    } catch (error) {
      console.error("Error creating transaction:", error);
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
      orderBy: { createdAt: "desc" },
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

  async countByUserId(userId: string): Promise<number> {
    return this.prisma.transactionHistory.count({ where: { userId } });
  }

  
}
