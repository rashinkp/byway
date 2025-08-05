import { TransactionHistoryRecord } from "../records/transaction-history.record";
import { TransactionStatus } from "../../domain/enum/transaction-status.enum";

export interface ITransactionRepository {
  create(transaction: TransactionHistoryRecord): Promise<TransactionHistoryRecord>;
  findById(id: string): Promise<TransactionHistoryRecord | null>;
  findByOrderId(orderId: string): Promise<TransactionHistoryRecord | null>;
  findByUserId(
    userId: string,
    page?: number,
    limit?: number
  ): Promise<TransactionHistoryRecord[]>;
  countByUserId(userId: string): Promise<number>;
  updateStatus(
    id: string,
    status: TransactionStatus,
    metadata?: Record<string, any>
  ): Promise<TransactionHistoryRecord>;
}
