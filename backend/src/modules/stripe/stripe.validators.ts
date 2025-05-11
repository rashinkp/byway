import { z } from "zod";

export const webhookSchema = z.object({
  event: z.object({
    id: z.string(),
    type: z.string(),
    data: z.object({
      object: z.record(z.any()),
    }),
  }),
  signature: z.string().min(1, "Webhook signature is required"),
});

export const checkoutSessionSchema = z.object({
  id: z.string(),
  customer_email: z.string().nullable(),
  payment_status: z.string().optional(),
  metadata: z
    .object({
      userId: z.string().uuid("Invalid user ID").optional(),
      courses: z.string().optional(), // Store as JSON string
    })
    .optional(),
  amount_total: z.number().nullable(),
});

export const createCheckoutSessionSchema = z.object({
  userId: z.string().uuid("Invalid user ID"),
  courses: z
    .array(
      z.object({
        id: z.string().uuid("Invalid course ID"),
        title: z.string().min(1, "Course title is required"),
        description: z.string().optional(),
        price: z.number().positive("Price must be positive"),
        offer: z.number().positive("Offer must be positive").optional(),
        thumbnail: z.string().optional(),
        duration: z.string().optional(),
        level: z.string().optional(),
      })
    )
    .min(1, "At least one course is required"),
  couponCode: z.string().optional(),
});
