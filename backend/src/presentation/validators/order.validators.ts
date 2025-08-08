import { z } from "zod";

export const getAllOrdersSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
});


export const CreateOrderDtoSchema = z.object({
  courses: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      description: z.string().optional(),
      price: z.number(),
      offer: z.number().optional(),
      thumbnail: z.string().optional(),
      duration: z.string().optional(),
      level: z.string().optional(),
    })
  ),
  paymentMethod: z.enum(["WALLET", "STRIPE", "PAYPAL", "RAZORPAY"]),
  couponCode: z.string().optional(),
});

export type CreateOrderDto = z.infer<typeof CreateOrderDtoSchema>;


export const GetAllOrdersDtoSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().default(10),
  sortBy: z.enum(["createdAt", "amount", "status"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
  status: z.enum(["ALL", "COMPLETED", "PENDING", "FAILED"]).default("ALL"),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  minAmount: z.coerce.number().optional(),
  maxAmount: z.coerce.number().optional(),
});

// Validator function
export function validateGetAllOrders(data: unknown) {
  return GetAllOrdersDtoSchema.parse(data);
}
