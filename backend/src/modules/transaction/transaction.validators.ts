import { z } from "zod";

export const CreateTransactionSchema = z.object({
  userId: z.string(),
  orderId: z.string(),
  amount: z.number(),
  type: z.enum(["PAYMENT", "REFUND"]),
  status: z.enum(["PENDING", "COMPLETED", "FAILED"]),
  courseId: z.string().nullable().default(null),
  paymentGateway: z
    .enum(["STRIPE", "PAYPAL", "RAZORPAY"])
    .nullable()
    .default(null),
  transactionId: z.string().nullable().default(null),
  walletId: z.string().optional(),
});

export const GetTransactionsByOrderSchema = z.object({
  orderId: z.string().uuid("Invalid order ID"),
});

export const GetTransactionsByUserSchema = z.object({
  userId: z.string().uuid("Invalid user ID"),
});

export const UpdateTransactionStatusSchema = z.object({
  transactionId: z.string().uuid("Invalid transaction ID"),
  status: z.enum(["PENDING", "COMPLETED", "FAILED"]),
  paymentGateway: z
    .enum(["STRIPE", "PAYPAL", "RAZORPAY"])
    .nullable()
    .optional(),
});
