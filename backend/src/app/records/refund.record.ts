export interface RefundRecord {
  id: string;
  userId: string;
  courseId: string;
  orderId: string;
  amount: number;
  reason: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "PROCESSED";
  processedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
} 