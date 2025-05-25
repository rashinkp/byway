import { z } from "zod";
import { GetAllOrdersDtoSchema } from "../../domain/dtos/order/order.dto";

export const getAllOrdersSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
});

export const validateGetAllOrders = async (query: any) => {
  return GetAllOrdersDtoSchema.parse(query);
}; 