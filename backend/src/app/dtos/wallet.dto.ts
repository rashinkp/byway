// ============================================================================
// WALLET REQUEST DTOs
// ============================================================================

export interface GetWalletRequestDto {
  userId: string;
}

export interface AddFundsRequestDto {
  userId: string;
  amount: number;
  paymentGateway: "STRIPE" | "PAYPAL" | "RAZORPAY";
  paymentMethod?: string;
}

export interface WithdrawFundsRequestDto {
  userId: string;
  amount: number;
  bankDetails: {
    accountNumber: string;
    ifscCode: string;
    accountHolderName: string;
  };
}

export interface GetWalletTransactionsRequestDto {
  userId: string;
  page?: number;
  limit?: number;
  type?: "CREDIT" | "DEBIT" | "ALL";
  startDate?: string;
  endDate?: string;
}

// ============================================================================
// WALLET RESPONSE DTOs
// ============================================================================

export interface WalletResponseDto {
  id: string;
  userId: string;
  balance: number;
  currency: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface WalletTransactionResponseDto {
  id: string;
  walletId: string;
  type: "CREDIT" | "DEBIT";
  amount: number;
  description: string;
  transactionType: "PAYMENT" | "REFUND" | "WITHDRAWAL" | "ADMIN_ADJUSTMENT";
  orderId?: string;
  courseId?: string;
  status: "PENDING" | "COMPLETED" | "FAILED" | "CANCELLED";
  paymentGateway?: string;
  metadata?: any;
  createdAt: Date;
  updatedAt: Date;
}

export interface WalletTransactionsListResponseDto {
  transactions: WalletTransactionResponseDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface WalletSummaryResponseDto {
  balance: number;
  totalCredits: number;
  totalDebits: number;
  pendingWithdrawals: number;
  monthlyTransactions: number;
} 