import { z } from "zod";

export const CreateOrderDtoSchema = z.object({
  courses: z.array(z.object({
    id: z.string(),
    title: z.string(),
    description: z.string().optional(),
    price: z.number(),
    offer: z.number().optional(),
    thumbnail: z.string().optional(),
    duration: z.string().optional(),
    level: z.string().optional(),
  })),
  paymentMethod: z.enum(["WALLET", "STRIPE", "PAYPAL", "RAZORPAY"]),
  couponCode: z.string().optional(),
});

export type CreateOrderDto = z.infer<typeof CreateOrderDtoSchema>; 