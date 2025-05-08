import { ITransaction } from "./transaction.types";


export interface ITransactionHistoryRepository {
  createTransaction(data: {
    orderId: string;
    userId: string;
    courseId: string | null;
    amount: number;
    type: "PAYMENT" | "REFUND";
    status: "PENDING" | "COMPLETED" | "FAILED";
    paymentGateway: "STRIPE" | "PAYPAL" | "RAZORPAY" | null;
    transactionId: string | null;
  }): Promise<ITransaction>;
  findTransactionById(transactionId: string): Promise<ITransaction | null>;
  findTransactionsByOrderId(orderId: string): Promise<ITransaction[]>;
  findTransactionsByUserId(userId: string): Promise<ITransaction[]>;
  updateTransactionStatus(
    transactionId: string,
    status: "PENDING" | "COMPLETED" | "FAILED",
    paymentGateway?: "STRIPE" | "PAYPAL" | "RAZORPAY" | null,
  ): Promise<ITransaction>;
}
