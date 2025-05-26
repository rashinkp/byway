import { Order } from "./order";

export interface Transaction {
  id: string;
  userId: string;
  orderId: string;
  amount: number;
  status: "COMPLETED" | "FAILED" | "PENDING";
  paymentGateway: string | null;
  createdAt: string;
  type: "PURCHASE" | "REFUND" | "PAYMENT" | "DEPOSIT" | "WITHDRAWAL";
  failureReason?: string;
  courseId?: string | null;
  order?: {
    id: string;
    items: Array<{
      courseId: string;
      title: string;
      description: string | null;
      price: number | null;
      coursePrice: number;
      thumbnail: string | null;
      level: string;
    }>;
  };
} 