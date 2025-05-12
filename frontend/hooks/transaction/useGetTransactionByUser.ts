import { getTransactionsByUser } from "@/api/transaction";
import { getTransactionsByUserSchema } from "@/lib/validations/transactions.validator";
import { Transaction } from "@/types/transactions";
import { useQuery } from "@tanstack/react-query";


export const useGetTransactionsByUser = () => {
  return useQuery<Transaction[], Error>({
    queryKey: ["transactions", "user"],
    queryFn: async () => {
      const response = await getTransactionsByUser();
      return response.data;
    },
  });
};



