import { RefundStatus } from "@prisma/client";

export interface RefundRecord {
  id: string;
  orderItemId: string;
  userId: string;
  courseId: string;
  amount: number;
  reason?: string | null;
  status: RefundStatus;
  transactionId?: string | null;
  createdAt: Date;
  updatedAt: Date;
} 