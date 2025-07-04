import { getTransactionsByOrder } from "@/api/transaction";
import { getTransactionsByOrderSchema } from "@/lib/validations/transactions.validator";
import { Transaction } from "@/types/transactions";
import { useQuery } from "@tanstack/react-query";

export const useGetTransactionsByOrder = (orderId: string) => {
	return useQuery<Transaction[], Error>({
		queryKey: ["transactions", "order", orderId],
		queryFn: async () => {
			const validatedData = getTransactionsByOrderSchema.parse({ orderId });
			const response = await getTransactionsByOrder(validatedData.orderId);
			return response.data;
		},
		enabled: !!orderId,
	});
};
