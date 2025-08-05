import { PaymentStatus, OrderStatus, PaymentGateway } from "@prisma/client";

export interface OrderRecord {
  id: string;
  userId: string;
  amount: number;
  paymentStatus: PaymentStatus;
  paymentGateway?: PaymentGateway | null;
  paymentId?: string | null;
  orderStatus: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
} 