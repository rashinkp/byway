import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Order } from "@/types/order";
import { createOrderSchema } from "@/lib/validations/order.validator";
import { createOrder } from "@/api/order";

export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation<
    Order,
    Error,
    { courseIds: string[]; couponCode?: string }
  >({
    mutationFn: async (data) => {
      const validatedData = createOrderSchema.parse(data);
      const response = await createOrder(validatedData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
    onError: (error) => {
      console.error("Create order error:", error.message);
    },
  });
};
