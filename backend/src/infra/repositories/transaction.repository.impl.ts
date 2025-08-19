import {
  PrismaClient,
  Prisma,
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
import { GenericRepository } from "./base/generic.repository";

export class TransactionRepository extends GenericRepository<Transaction> implements ITransactionRepository {
  constructor(private _prisma: PrismaClient) {
    super(_prisma, 'transactionHistory');
  }

  protected getPrismaModel() {
    return this._prisma.transactionHistory;
  }

  protected mapToEntity(transaction: any): Transaction {
    return new Transaction({
      id: transaction.id,
      orderId: transaction.orderId || undefined,
      userId: transaction.userId,
      amount: Number(transaction.amount),
      type: transaction.type as TransactionType,
      status: transaction.status as TransactionStatus,
      paymentGateway: transaction.paymentGateway as PaymentGateway,
      courseId: transaction.courseId || undefined,
      transactionId: transaction.transactionId || undefined,
      walletId: transaction.walletId || undefined,
      createdAt: transaction.createdAt,
      updatedAt: transaction.updatedAt,
    });
  }

  protected mapToPrismaData(entity: any): any {
    if (entity instanceof Transaction) {
      return {
        userId: entity.userId,
        amount: entity.amount,
        type: entity.type as PrismaTransactionType,
        status: entity.status as PrismaTransactionStatus,
        paymentGateway: entity.paymentGateway as PrismaPaymentGateway,
        paymentMethod: entity.paymentMethod,
        paymentDetails: entity.paymentDetails ? (entity.paymentDetails as Prisma.InputJsonValue) : undefined,
        courseId: entity.courseId,
        transactionId: entity.transactionId,
        metadata: entity.metadata ? (entity.metadata as Prisma.InputJsonValue) : undefined,
        orderId: entity.orderId,
      };
    }
    return entity;
  }

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
      const createdTransaction = await this._prisma.transactionHistory.create({
        data: {
          userId: transaction.userId,
          amount: transaction.amount,
          type: transaction.type as PrismaTransactionType,
          status: transaction.status as PrismaTransactionStatus,
          paymentGateway: transaction.paymentGateway as PrismaPaymentGateway,
          paymentMethod: transaction.paymentMethod,
          paymentDetails: transaction.paymentDetails ? (transaction.paymentDetails as Prisma.InputJsonValue) : undefined,
          courseId: transaction.courseId,
          transactionId: transaction.transactionId,
          metadata: transaction.metadata ? (transaction.metadata as Prisma.InputJsonValue) : undefined,
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
      throw error;
    }
  }

  async findById(id: string): Promise<Transaction | null> {
    return this.findByIdGeneric(id);
  }

  // Additional generic methods
  async find(filter?: any): Promise<Transaction[]> {
    return this.findGeneric(filter);
  }

  async update(id: string, transaction: Transaction): Promise<Transaction> {
    return this.updateGeneric(id, transaction);
  }

  async delete(id: string): Promise<void> {
    return this.deleteGeneric(id);
  }

  async softDelete(id: string): Promise<Transaction> {
    const deleted = await this._prisma.transactionHistory.update({
      where: { id },
      data: {
        updatedAt: new Date(),
      },
    });
    return this.mapToEntity(deleted);
  }

  async count(filter?: any): Promise<number> {
    return this.countGeneric(filter);
  }

  async findByOrderId(orderId: string): Promise<Transaction | null> {
    const transaction = await this._prisma.transactionHistory.findFirst({
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
    const transactions = await this._prisma.transactionHistory.findMany({
      where: { userId },
      skip: page ? (page - 1) * (limit || 10) : undefined,
      take: limit,
      orderBy: { createdAt: "desc" },
    });
    return transactions.map((t) => this.mapToEntity(t));
  }

  async updateStatus(
    id: string,
    status: TransactionStatus,
    metadata?: Record<string, unknown>
  ): Promise<Transaction> {
    const updated = await this._prisma.transactionHistory.update({
      where: { id },
      data: {
        status: this.mapToPrismaTransactionStatus(status),
        updatedAt: new Date(),
        ...(metadata && { metadata: metadata as Prisma.InputJsonValue }),
      },
    });
    return this.mapToTransaction(updated);
  }

  async countByUserId(userId: string): Promise<number> {
    return this._prisma.transactionHistory.count({ where: { userId } });
  }
}
