import { TransactionType, TransactionStatus, PaymentGateway } from "@prisma/client";

export interface TransactionHistoryRecord {
  id: string;
  orderId?: string | null;
  userId: string;
  amount: number;
  type: TransactionType;
  status: TransactionStatus;
  paymentGateway: PaymentGateway;
  paymentMethod?: string | null;
  paymentDetails?: any | null;
  courseId?: string | null;
  transactionId?: string | null;
  metadata?: any | null;
  walletId?: string | null;
  createdAt: Date;
  updatedAt: Date;
} 