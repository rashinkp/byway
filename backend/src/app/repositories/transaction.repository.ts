import { Transaction } from "../../domain/entities/transaction.entity";
import { TransactionStatus } from "../../domain/enum/transaction-status.enum";

export interface ITransactionRepository {
  create(transaction: Transaction): Promise<Transaction>;
  findById(id: string): Promise<Transaction | null>;
  findByOrderId(orderId: string): Promise<Transaction[]>;
  findByUserId(
    userId: string,
    page?: number,
    limit?: number
  ): Promise<Transaction[]>;
  updateStatus(
    id: string,
    status: TransactionStatus,
    metadata?: Record<string, any>
  ): Promise<Transaction>;
}
