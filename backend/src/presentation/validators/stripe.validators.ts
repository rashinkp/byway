import { z } from "zod";

export const validateCreateCheckoutSession = {
  body: z.object({
    userId: z.string().uuid("Invalid user ID"),
    courses: z.array(z.object({
      id: z.string().uuid("Invalid course ID"),
      title: z.string(),
      description: z.string().optional(),
      price: z.number().positive(),
      offer: z.number().positive().optional(),
      // Accept either a full URL or an S3 key
      thumbnail: z.union([z.string(), z.string().min(1)]).optional(),
      duration: z.string().optional(),
      level: z.string().optional()
    })),
    couponCode: z.string().optional()
  })
}; 