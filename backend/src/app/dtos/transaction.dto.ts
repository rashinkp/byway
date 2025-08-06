import { TransactionStatus } from "@/domain/enum/transaction-status.enum";
import { TransactionType } from "@/domain/enum/transaction-type.enum";
import { PaymentGateway } from "../providers/payment-gateway.interface";


export interface ICreateTransactionInputDTO {
  orderId?: string;
  userId: string;
  amount: number;
  type?: TransactionType;
  status?: TransactionStatus;
  paymentGateway?: PaymentGateway;
  paymentMethod?: string;
  paymentDetails?: Record<string, any>;
  courseId?: string;
  transactionId?: string;
  metadata?: Record<string, any>;
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
  paymentDetails?: Record<string, any>;
  courseId?: string;
  transactionId?: string;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface IUpdateTransactionStatusInputDTO {
  id: string;
  status: TransactionStatus;
  metadata?: Record<string, any>;
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
