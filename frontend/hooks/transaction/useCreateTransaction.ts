import { createTransaction } from "@/api/transaction";
import { createTransactionSchema } from "@/lib/validations/transactions.validator";
import { Transaction } from "@/types/transactions";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateTransaction = () => {
	const queryClient = useQueryClient();

	return useMutation<
		Transaction,
		Error,
		{
			orderId: string;
			userId: string;
			courseId?: string | null;
			amount: number;
			type: "PAYMENT" | "REFUND";
			status?: "PENDING" | "COMPLETED" | "FAILED";
			paymentGateway?: "STRIPE" | "PAYPAL" | "RAZORPAY" | null;
			transactionId?: string | null;
		}
	>({
		mutationFn: async (data) => {
			const validatedData = createTransactionSchema.parse(data);
			const response = await createTransaction(validatedData);
			return response.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["transactions"] });
		},
		onError: (error) => {
			console.error("Create transaction error:", error.message);
		},
	});
};
