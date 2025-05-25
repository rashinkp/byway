import { z } from "zod";

export const createCheckoutSessionSchema = z.object({
  userId: z.string().uuid(),
  courses: z.array(
    z.object({
      id: z.string().uuid(),
      title: z.string(),
      description: z.string().optional(),
      price: z.number().positive(),
      offer: z.number().positive().optional(),
      thumbnail: z.string().url().optional(),
      duration: z.string().optional(),
      level: z.string().optional(),
    })
  ),
  couponCode: z.string().optional(),
});

export type CreateCheckoutSessionDto = z.infer<typeof createCheckoutSessionSchema>; 