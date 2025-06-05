import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createOrder, CreateOrderRequest } from "@/api/order";
import { toast } from "sonner";

export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateOrderRequest) => {
      const response = await createOrder(data);
      return response.data;
    },
    onSuccess: (data) => {
      // Invalidate orders query to refetch the list
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      
      // Show success message
      if (data.paymentGateway === "WALLET") {
        toast.success("Order created and paid successfully");
      } else {
        toast.success("Order created successfully. Proceed with payment.");
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create order");
    },
  });
}; 