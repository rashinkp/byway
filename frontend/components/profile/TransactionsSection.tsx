"use client";

import React, { useState } from "react";
import { useGetTransactionsByUser } from "@/hooks/transaction/useGetTransactionByUser";
import { TransactionList } from "@/components/transactions/TransactionList";
import { Pagination } from "@/components/ui/Pagination";
import { CreditCard } from "lucide-react";
import ErrorDisplay from "@/components/ErrorDisplay";

export default function TransactionsSection() {
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
		<div className="w-full space-y-6">
			<div className="bg-white dark:bg-[#232326] rounded-xl p-8 mb-8 text-center">
				<h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-gray-100">Transaction History</h1>
				<p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
					View all your transaction history and payment records.
				</p>
			</div>

			{/* Transactions List */}
			<div className="overflow-hidden">
				<div className="p-4 sm:p-6">
					{transactionsError ? (
						<ErrorDisplay
							error={transactionsError}
							onRetry={transactionsRefetch}
							title="Transaction Error"
							description="There was a problem loading your transactions. Please try again."
						/>
					) : (
						<TransactionList
							transactions={transactions}
							isLoading={isTransactionsLoading}
						/>
					)}
				</div>

				{/* Pagination */}
				{!isTransactionsLoading && totalPages > 1 && (
					<div className="px-4 sm:px-6 py-4 border-t border-[var(--color-muted)]">
						<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
							<p className="text-sm text-[var(--color-muted)] text-center sm:text-left">
								Showing {transactions.length} of {total} transactions
							</p>
							<Pagination
								currentPage={page}
								totalPages={totalPages}
								onPageChange={setPage}
							/>
						</div>
					</div>
				)}

				{!isTransactionsLoading && transactions.length === 0 && (
					<div className="text-center py-12">
						<div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-4 text-[var(--color-muted)]">
							<CreditCard className="w-full h-full" />
						</div>
						<h3 className="text-lg font-medium text-[var(--color-primary-dark)] mb-2">
							No transactions found
						</h3>
						<p className="text-sm sm:text-base text-[var(--color-muted)] max-w-md mx-auto">
							You haven&apos;t made any transactions yet. Start by making a
							purchase or adding funds to your wallet.
						</p>
					</div>
				)}
			</div>
		</div>
	);
}
