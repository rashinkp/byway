import { getTransactionById } from "@/api/transaction";
import { getTransactionByIdSchema } from "@/lib/validations/transactions.validator";
import { Transaction } from "@/types/transactions";
import { useQuery } from "@tanstack/react-query";

export const useGetTransactionById = (transactionId: string) => {
  return useQuery<Transaction, Error>({
    queryKey: ["transactions", transactionId],
    queryFn: async () => {
      const validatedData = getTransactionByIdSchema.parse({ transactionId });
      const response = await getTransactionById(validatedData.transactionId);
      return response.data;
    },
    enabled: !!transactionId,
  });
};
