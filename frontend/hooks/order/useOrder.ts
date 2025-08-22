import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateOrderRequest, Order } from "@/types/order";
import { CreateOrderDtoSchema } from "@/lib/validations/order";
import { createOrder } from "@/api/order";

export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation<Order, Error, CreateOrderRequest>({
    mutationFn: async (data) => {
      const validatedData = CreateOrderDtoSchema.parse(data);
      const response = await createOrder(validatedData);
      return response.data.order;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });
};
