import { z } from "zod";

export const createOrderSchema = z.object({
  courseIds: z
    .array(z.string().uuid("Invalid course ID"))
    .min(1, "At least one course ID is required"),
  couponCode: z.string().optional(),
});

export const updateOrderStatusSchema = z.object({
  orderId: z.string().uuid("Invalid order ID"),
  paymentStatus: z.enum(["PENDING", "COMPLETED", "FAILED", "REFUNDED"]),
  paymentId: z.string().optional(),
  paymentGateway: z
    .enum(["STRIPE", "PAYPAL", "RAZORPAY"])
    .nullable()
    .optional(),
});
