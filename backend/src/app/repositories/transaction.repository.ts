import { Transaction } from "../../domain/entities/transaction.entity";

export interface ITransactionRepository {
  createTransaction(transaction: {
    orderId: string;
    userId: string;
    courseId: string;
    amount: number;
    type: string;
    status: string;
    paymentGateway: string;
    transactionId: string;
  }): Promise<Transaction>;
} 