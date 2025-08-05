import { TransactionHistoryRecord } from "../records/transaction-history.record";

export interface ITransactionRepository {
  create(transaction: TransactionHistoryRecord): Promise<TransactionHistoryRecord>;
  findByUserId(userId: string): Promise<TransactionHistoryRecord[]>;
  findByOrderId(orderId: string): Promise<TransactionHistoryRecord[]>;
  findByCourseId(courseId: string): Promise<TransactionHistoryRecord[]>;
  update(transaction: TransactionHistoryRecord): Promise<TransactionHistoryRecord>;
  getTransactionStats(options: { userId?: string }): Promise<{
    totalTransactions: number;
    totalAmount: number;
    successfulTransactions: number;
    failedTransactions: number;
  }>;
}
