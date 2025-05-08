import { updateTransactionStatus } from "@/api/transaction";
import { updateTransactionStatusSchema } from "@/lib/validations/transactions.validator";
import { Transaction } from "@/types/transactions";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUpdateTransactionStatus = () => {
  const queryClient = useQueryClient();

  return useMutation<
    Transaction,
    Error,
    {
      transactionId: string;
      status: "PENDING" | "COMPLETED" | "FAILED";
      paymentGateway?: "STRIPE" | "PAYPAL" | "RAZORPAY" | null;
    }
  >({
    mutationFn: async (data) => {
      const validatedData = updateTransactionStatusSchema.parse(data);
      const response = await updateTransactionStatus(validatedData);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["transactions", data.id] });
      queryClient.invalidateQueries({
        queryKey: ["transactions", "order", data.orderId],
      });
      queryClient.invalidateQueries({
        queryKey: ["transactions", "user", data.userId],
      });
    },
    onError: (error) => {
      console.error("Update transaction status error:", error.message);
    },
  });
};



