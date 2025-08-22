import { PaymentGateway } from "../../domain/enum/payment-gateway.enum";
import { TransactionStatus } from "../../domain/enum/transaction-status.enum";
import { TransactionType } from "../../domain/enum/transaction-type.enum";


export interface ICreateTransactionInputDTO {
  orderId?: string;
  userId: string;
  amount: number;
  type?: TransactionType;
  status?: TransactionStatus;
  paymentGateway?: PaymentGateway;
  paymentMethod?: string;
  paymentDetails?: Record<string, unknown>;
  courseId?: string;
  transactionId?: string;
  metadata?: Record<string, unknown>;
}

export interface ITransactionOutputDTO {
  id: string;
  orderId?: string;
  userId: string;
  amount: number;
  type: TransactionType;
  status: TransactionStatus;
  paymentGateway: PaymentGateway;
  paymentMethod?: string;
  paymentDetails?: Record<string, unknown>;
  courseId?: string;
  transactionId?: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUpdateTransactionStatusInputDTO {
  id: string;
  status: TransactionStatus;
  metadata?: Record<string, unknown>;
}

export interface IGetTransactionsByUserInputDTO {
  userId: string;
  page?: number;
  limit?: number;
}

export interface IGetTransactionsByOrderInputDTO {
  orderId: string;
  page?: number;
  limit?: number;
}
