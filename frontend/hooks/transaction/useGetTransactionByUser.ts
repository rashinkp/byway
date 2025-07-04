import { getTransactionsByUser } from "@/api/transaction";
import { Transaction } from "@/types/transaction";
import { useQuery } from "@tanstack/react-query";

export const useGetTransactionsByUser = (page = 1, limit = 10) => {
	return useQuery<
		{ items: Transaction[]; total: number; page: number; totalPages: number },
		Error
	>({
		queryKey: ["transactions", "user", page, limit],
		queryFn: async () => {
			const response = await getTransactionsByUser(page, limit);
			return response.data;
		},
	});
};
