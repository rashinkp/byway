export interface OrderRecord {
  id: string;
  userId: string;
  totalAmount: number;
  paymentStatus: "PENDING" | "COMPLETED" | "FAILED" | "CANCELLED" | "REFUNDED";
  orderStatus: "PENDING" | "PROCESSING" | "COMPLETED" | "CANCELLED" | "FAILED";
  paymentMethod?: string | null;
  createdAt: Date;
  updatedAt: Date;
} 