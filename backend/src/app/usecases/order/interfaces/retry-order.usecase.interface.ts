import { Order } from "../../../../domain/entities/order.entity";
import { Transaction } from "../../../../domain/entities/transaction.entity";

export interface RetryOrderResponse {
  order: Order;
  transaction: Transaction;
  session: {
    id: string;
    url: string;
    payment_status: string;
    amount_total: number;
  };
}

export interface IRetryOrderUseCase {
  execute(userId: string, orderId: string): Promise<RetryOrderResponse>;
} 