import { z } from "zod";

export const CreateOrderSchema = z.object({
  userId: z.string().uuid("Invalid user ID"),
  courses: z
    .array(
      z.object({
        id: z.string().uuid("Invalid course ID"),
        title: z.string().min(1, "Course title is required"),
        price: z.number().positive("Price must be positive"),
        offer: z.number().positive("Offer must be positive").optional(),
      })
    )
    .min(1, "At least one course is required"),
  couponCode: z.string().optional(),
});

export const UpdateOrderStatusSchema = z.object({
  orderId: z.string().uuid("Invalid order ID"),
  paymentStatus: z.enum(["PENDING", "COMPLETED", "FAILED", "REFUNDED"]),
  paymentId: z.string().optional(),
  paymentGateway: z
    .enum(["STRIPE", "PAYPAL", "RAZORPAY"])
    .nullable()
    .optional(),
});
