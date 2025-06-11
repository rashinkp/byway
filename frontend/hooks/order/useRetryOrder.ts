import { useMutation, useQueryClient } from "@tanstack/react-query";
import { retryOrder } from "@/api/order";
import { toast } from "sonner";

export const useRetryOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (orderId: string) => {
      const response = await retryOrder(orderId);
      return response.data;
    },
    onSuccess: (data) => {
      // Invalidate orders query to refetch the list
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      // Redirect to Stripe checkout
      if (data.session?.url) {
        window.location.href = data.session.url;
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to retry order");
    },
  });
}; 