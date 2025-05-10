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
      courseIds: z.string().optional(),
    })
    .optional(),
  amount_total: z.number().nullable(),
});

export const createCheckoutSessionSchema = z.object({
  courseIds: z
    .array(z.string().uuid("Invalid course ID"))
    .min(1, "At least one course ID is required"),
  userId: z.string().uuid("Invalid user ID"),
  couponCode: z.string().optional(),
});
