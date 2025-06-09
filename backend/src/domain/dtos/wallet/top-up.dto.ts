import { z } from "zod";

export const TopUpWalletDtoSchema = z.object({
  amount: z.number().positive(),
  paymentMethod: z.enum(["WALLET", "STRIPE", "PAYPAL", "RAZORPAY"]),
});

export type TopUpWalletDto = z.infer<typeof TopUpWalletDtoSchema>; 