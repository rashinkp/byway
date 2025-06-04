import { getTransactionsByUser } from "@/api/transaction";
import { Transaction } from "@/types/transaction";
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



