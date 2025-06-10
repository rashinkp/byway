import { z } from "zod";

const courseSchema = z.object({
  id: z.string().min(1, "Course ID is required"),
  title: z.string().min(1, "Course title is required"),
  description: z.string().nullable().optional(),
  price: z.number().min(0).optional(),
  offer: z.number().min(0).optional(),
  thumbnail: z.string().nullable().optional(),
  duration: z.string().optional(),
  level: z.string().optional(),
});

export const createCheckoutSessionSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  amount: z.number().min(0).optional(),
  currency: z.string().optional(),
  isWalletTopUp: z.boolean().optional(),
  courses: z.array(courseSchema).min(1, "At least one course is required").optional(),
  couponCode: z.string().optional(),
  orderId: z.string().optional(),
  paymentMethod: z.enum(["WALLET", "STRIPE", "PAYPAL", "RAZORPAY"]).optional(),
});

export type CreateCheckoutSessionDto = z.infer<typeof createCheckoutSessionSchema>; 