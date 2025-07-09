import { z } from "zod";

export const createOrderSchema = z.object({
  courses: z.array(
    z.object({
      id: z.string().uuid(),
      title: z.string(),
      description: z.string(),
      thumbnail: z.string(),
      price: z.number(),
      offer: z.number(),
      duration: z.string(),
      lectures: z.number(),
      level: z.string(),
      creator: z.object({
        name: z.string(),
      }),
    })
  ),
  paymentMethod: z.enum(["WALLET", "STRIPE", "PAYPAL", "RAZORPAY"]),
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
