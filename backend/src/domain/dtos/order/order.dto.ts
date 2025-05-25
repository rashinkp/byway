import { z } from "zod";

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

export type GetAllOrdersDto = z.infer<typeof GetAllOrdersDtoSchema>; 