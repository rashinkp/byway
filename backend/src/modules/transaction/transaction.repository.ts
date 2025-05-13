import { PrismaClient } from "@prisma/client";
import { ITransactionHistoryRepository } from "./transaction.repository.interface";
import { ITransaction } from "./transaction.types";

export class TransactionHistoryRepository implements ITransactionHistoryRepository {
  constructor(private prisma: PrismaClient) {}

  async createTransaction(data: {
    orderId: string;
    userId: string;
    courseId: string | null;
    amount: number;
    type: "PAYMENT" | "REFUND";
    status: "PENDING" | "COMPLETED" | "FAILED";
    paymentGateway: "STRIPE" | "PAYPAL" | "RAZORPAY" | null;
    transactionId: string | null;
    walletId?: string; // Make walletId optional
  }): Promise<ITransaction> {
    return this.prisma.transactionHistory.create({
      data: {
        orderId: data.orderId,
        userId: data.userId,
        courseId: data.courseId,
        amount: data.amount,
        type: data.type,
        status: data.status,
        paymentGateway: data.paymentGateway,
        transactionId: data.transactionId,
        walletId: data.walletId,
      },
    }) as unknown as Promise<ITransaction>;
  }

  async findTransactionById(
    transactionId: string
  ): Promise<ITransaction | null> {
    return this.prisma.transactionHistory.findUnique({
      where: { id: transactionId },
    }) as unknown as Promise<ITransaction | null>;
  }

  async findTransactionsByOrderId(orderId: string): Promise<ITransaction[]> {
    return this.prisma.transactionHistory.findMany({
      where: { orderId },
    }) as unknown as Promise<ITransaction[]>;
  }

  async findTransactionsByUserId(userId: string): Promise<ITransaction[]> {
    return this.prisma.transactionHistory.findMany({
      where: { userId },
    }) as unknown as Promise<ITransaction[]>;
  }

  async updateTransactionStatus(
    transactionId: string,
    status: "PENDING" | "COMPLETED" | "FAILED",
    paymentGateway?: "STRIPE" | "PAYPAL" | "RAZORPAY" | null
  ): Promise<ITransaction> {
    return this.prisma.transactionHistory.update({
      where: { id: transactionId },
      data: {
        status,
        paymentGateway,
        transactionId,
      },
    }) as unknown as Promise<ITransaction>;
  }
}
