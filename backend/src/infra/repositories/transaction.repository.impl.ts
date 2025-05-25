import { PrismaClient } from "@prisma/client";
import { ITransactionRepository } from "../../app/repositories/transaction.repository";
import { Transaction } from "../../domain/entities/transaction.entity";
import { v4 as uuidv4 } from "uuid";
import { TransactionType } from "../../domain/enum/transaction-type.enum";
import { TransactionStatus } from "../../domain/enum/transaction-status.enum";
import { PaymentGateway } from "../../domain/enum/payment-gateway.enum";

export class TransactionRepository implements ITransactionRepository {
  constructor(private prisma: PrismaClient) {}

  private mapToTransaction(prismaTransaction: any): Transaction {
    return new Transaction(
      prismaTransaction.id,
      prismaTransaction.orderId,
      prismaTransaction.userId,
      prismaTransaction.courseId,
      Number(prismaTransaction.amount),
      prismaTransaction.type as TransactionType,
      prismaTransaction.status as TransactionStatus,
      prismaTransaction.paymentGateway as PaymentGateway,
      prismaTransaction.transactionId,
      prismaTransaction.createdAt,
      prismaTransaction.updatedAt
    );
  }

  async createTransaction(transaction: {
    orderId: string;
    userId: string;
    courseId: string;
    amount: number;
    type: TransactionType;
    status: TransactionStatus;
    paymentGateway: PaymentGateway;
    transactionId: string;
  }): Promise<Transaction> {
    const created = await this.prisma.transactionHistory.create({
      data: {
        id: uuidv4(),
        orderId: transaction.orderId,
        userId: transaction.userId,
        courseId: transaction.courseId,
        amount: transaction.amount,
        type: transaction.type,
        status: transaction.status,
        paymentGateway: transaction.paymentGateway,
        transactionId: transaction.transactionId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    return this.mapToTransaction(created);
  }
} 