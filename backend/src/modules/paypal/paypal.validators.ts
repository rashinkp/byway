import { z } from "zod";

export const createOrderSchema = z.object({
  order_price: z
    .string()
    .regex(
      /^\d+(\.\d{1,2})?$/,
      "Order price must be a valid amount (e.g., 99.99)"
    ),
  userId: z.string().uuid("Invalid user ID"),
});

export const captureOrderSchema = z.object({
  orderID: z.string().min(1, "Order ID is required"),
  userId: z.string().uuid("Invalid user ID"),
});
