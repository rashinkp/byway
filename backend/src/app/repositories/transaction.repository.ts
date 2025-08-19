import { Transaction } from "../../domain/entities/transaction.entity";
import { TransactionStatus } from "../../domain/enum/transaction-status.enum";
import { IGenericRepository } from "./base/generic-repository.interface";

export interface ITransactionRepository extends IGenericRepository<Transaction> {
  findByOrderId(orderId: string): Promise<Transaction | null>;
  findByUserId(
    userId: string,
    page?: number,
    limit?: number
  ): Promise<Transaction[]>;
  countByUserId(userId: string): Promise<number>;
  updateStatus(
    id: string,
    status: TransactionStatus,
    metadata?: Record<string, unknown>
  ): Promise<Transaction>;
}
