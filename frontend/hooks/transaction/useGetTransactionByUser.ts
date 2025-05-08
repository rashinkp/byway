import { getTransactionsByUser } from "@/api/transaction";
import { getTransactionsByUserSchema } from "@/lib/validations/transactions.validator";
import { Transaction } from "@/types/transactions";
import { useQuery } from "@tanstack/react-query";


export const useGetTransactionsByUser = (userId: string) => {
  return useQuery<Transaction[], Error>({
    queryKey: ["transactions", "user", userId],
    queryFn: async () => {
      const validatedData = getTransactionsByUserSchema.parse({ userId });
      const response = await getTransactionsByUser(validatedData.userId);
      return response.data;
    },
    enabled: !!userId,
  });
};



