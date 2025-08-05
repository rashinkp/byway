export interface TransactionHistoryRecord {
  id: string;
  userId: string;
  courseId?: string | null;
  orderId?: string | null;
  amount: number;
  type: "PURCHASE" | "REFUND" | "WITHDRAWAL" | "DEPOSIT" | "ADMIN_SHARE" | "INSTRUCTOR_SHARE";
  status: "PENDING" | "COMPLETED" | "FAILED" | "CANCELLED";
  paymentGateway?: "PAYPAL" | "STRIPE" | "INTERNAL" | null;
  transactionId?: string | null;
  description?: string | null;
  createdAt: Date;
  updatedAt: Date;
} 