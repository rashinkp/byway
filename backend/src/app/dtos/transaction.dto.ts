// ============================================================================
// TRANSACTION REQUEST DTOs
// ============================================================================

export interface GetAllTransactionsRequestDto {
  page?: number;
  limit?: number;
  sortBy?: "createdAt" | "amount" | "status";
  sortOrder?: "asc" | "desc";
  status?: "PENDING" | "COMPLETED" | "FAILED" | "CANCELLED" | "ALL";
  type?: "PAYMENT" | "REFUND" | "WITHDRAWAL" | "ALL";
  startDate?: string;
  endDate?: string;
  minAmount?: number;
  maxAmount?: number;
  userId?: string;
}

export interface GetTransactionByIdRequestDto {
  transactionId: string;
}

export interface GetUserTransactionsRequestDto {
  userId: string;
  page?: number;
  limit?: number;
  status?: "PENDING" | "COMPLETED" | "FAILED" | "CANCELLED" | "ALL";
  type?: "PAYMENT" | "REFUND" | "WITHDRAWAL" | "ALL";
}

export interface CreateTransactionRequestDto {
  userId: string;
  amount: number;
  type: "PAYMENT" | "REFUND" | "WITHDRAWAL";
  paymentGateway: "STRIPE" | "PAYPAL" | "RAZORPAY" | "INTERNAL";
  orderId?: string;
  courseId?: string;
  description: string;
  metadata?: any;
}

export interface UpdateTransactionStatusRequestDto {
  transactionId: string;
  status: "PENDING" | "COMPLETED" | "FAILED" | "CANCELLED";
  transactionId?: string;
  failureReason?: string;
}

// ============================================================================
// TRANSACTION RESPONSE DTOs
// ============================================================================

export interface TransactionResponseDto {
  id: string;
  userId: string;
  amount: number;
  type: "PAYMENT" | "REFUND" | "WITHDRAWAL";
  status: "PENDING" | "COMPLETED" | "FAILED" | "CANCELLED";
  paymentGateway: "STRIPE" | "PAYPAL" | "RAZORPAY" | "INTERNAL";
  orderId?: string;
  courseId?: string;
  description: string;
  transactionId?: string;
  failureReason?: string;
  metadata?: any;
  createdAt: Date;
  updatedAt: Date;
  user: {
    id: string;
    name: string;
    email: string;
  };
  course?: {
    id: string;
    title: string;
    thumbnail?: string;
  };
}

export interface TransactionsListResponseDto {
  transactions: TransactionResponseDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface TransactionSummaryResponseDto {
  totalTransactions: number;
  totalAmount: number;
  completedTransactions: number;
  failedTransactions: number;
  pendingTransactions: number;
  monthlyTransactions: number;
  monthlyAmount: number;
} 