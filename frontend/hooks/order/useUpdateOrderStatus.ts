import { updateOrderStatus } from "@/api/order";
import { updateOrderStatusSchema } from "@/lib/validations/order";
import { Order } from "@/types/order";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation<
    Order,
    Error,
    {
      orderId: string;
      paymentStatus: "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED";
      paymentId?: string;
      paymentGateway?: "STRIPE" | "PAYPAL" | "RAZORPAY" | null;
    }
  >({
    mutationFn: async (data) => {
      const validatedData = updateOrderStatusSchema.parse(data);
      const response = await updateOrderStatus(validatedData);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["orders", data.id] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["enrollments"] });
    },
    onError: (error) => {
      console.error("Update order status error:", error.message);
    },
  });
};
