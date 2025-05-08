import { z } from "zod";

export const createTransactionSchema = z.object({
  orderId: z.string().uuid("Invalid order ID"),
  userId: z.string().uuid("Invalid user ID"),
  courseId: z.string().uuid("Invalid course ID").nullable().optional(),
  amount: z.number().positive("Amount must be positive"),
  type: z.enum(["PAYMENT", "REFUND"]),
  status: z.enum(["PENDING", "COMPLETED", "FAILED"]).optional(),
  paymentGateway: z
    .enum(["STRIPE", "PAYPAL", "RAZORPAY"])
    .nullable()
    .optional(),
  transactionId: z.string().nullable().optional(),
});

export const getTransactionByIdSchema = z.object({
  transactionId: z.string().uuid("Invalid transaction ID"),
});

export const getTransactionsByOrderSchema = z.object({
  orderId: z.string().uuid("Invalid order ID"),
});

export const getTransactionsByUserSchema = z.object({
  userId: z.string().uuid("Invalid user ID"),
});

export const updateTransactionStatusSchema = z.object({
  transactionId: z.string().uuid("Invalid transaction ID"),
  status: z.enum(["PENDING", "COMPLETED", "FAILED"]),
  paymentGateway: z
    .enum(["STRIPE", "PAYPAL", "RAZORPAY"])
    .nullable()
    .optional(),
});
