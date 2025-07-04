import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createOrder, CreateOrderRequest } from "@/api/order";
import { toast } from "sonner";

export const useCreateOrder = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (data: CreateOrderRequest) => {
			const response = await createOrder(data);
			return response;
		},
		onSuccess: () => {
			// Invalidate orders query to refetch the list
			queryClient.invalidateQueries({ queryKey: ["orders"] });
		},
		onError: (error: Error) => {
			toast.error(error.message || "Failed to create order");
		},
	});
};
