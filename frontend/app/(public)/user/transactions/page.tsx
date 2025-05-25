"use client";
import { useGetTransactionsByUser } from "@/hooks/transaction/useGetTransactionByUser";
import { TransactionList } from "@/components/transactions/TransactionList";

export default function TransactionsPage() {
  const {
    data: transactions,
    isLoading: isTransactionsLoading,
    error: transactionsError,
    refetch: transactionsRefetch,
  } = useGetTransactionsByUser();

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm p-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-8">
          Transaction History
        </h2>
        <TransactionList
          transactions={transactions}
          isLoading={isTransactionsLoading}
          error={transactionsError}
          onRetry={transactionsRefetch}
        />
      </div>
    </div>
  );
} 