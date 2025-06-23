"use client";
import { useGetTransactionsByUser } from "@/hooks/transaction/useGetTransactionByUser";
import { TransactionList } from "@/components/transactions/TransactionList";
import { useState } from "react";
import { Pagination } from "@/components/ui/Pagination";

export default function TransactionsPage() {
  const [page, setPage] = useState(1);
  const limit = 15;
  const {
    data: transactionsData,
    isLoading: isTransactionsLoading,
    error: transactionsError,
    refetch: transactionsRefetch,
  } = useGetTransactionsByUser(page, limit);

  const transactions = transactionsData?.items || [];
  const total = transactionsData?.total || 0;
  const totalPages = transactionsData?.totalPages || 1;

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
        {/* Pagination Controls */}
        <div className="flex justify-between items-center mt-6">
          <span className="text-sm text-gray-600">
            Showing {transactions.length} of {total} transactions
          </span>
          {totalPages > 1 && (
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          )}
        </div>
      </div>
    </div>
  );
} 