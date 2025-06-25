"use client";

import React, { useState } from "react";
import { useGetTransactionsByUser } from "@/hooks/transaction/useGetTransactionByUser";
import { TransactionList } from "@/components/transactions/TransactionList";
import { Pagination } from "@/components/ui/Pagination";
import {
  CreditCard,
  Receipt,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  Filter,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function TransactionsSection() {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
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

  // Calculate summary stats
  const totalIncome = transactions
    .filter((t) => t.type === "REFUND" || t.type === "WALLET_TOPUP")
    .reduce((sum, t) => sum + (t.amount || 0), 0);

  const totalExpense = transactions
    .filter((t) => t.type === "PURCHASE" || t.type === "PAYMENT" || t.type === "WALLET_WITHDRAWAL")
    .reduce((sum, t) => sum + (t.amount || 0), 0);

  return (
    <div className="w-full space-y-6">
      {/* Header Section */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
              Transaction History
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              View all your transaction history and payment records
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              <span className="hidden sm:inline">Filters</span>
            </Button>
          </div>
        </div>

        {/* Collapsible Search and Filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                <span className="hidden sm:inline">Date Range</span>
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">
                Total Transactions
              </p>
              <p className="text-2xl font-bold text-gray-900">{total}</p>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <Receipt className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">
                Total Income
              </p>
              <p className="text-2xl font-bold text-green-600">
                ${totalIncome.toFixed(2)}
              </p>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 sm:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">
                Total Expenses
              </p>
              <p className="text-2xl font-bold text-red-600">
                ${totalExpense.toFixed(2)}
              </p>
            </div>
            <div className="bg-red-50 p-3 rounded-lg">
              <TrendingDown className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Transactions List */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-gray-700" />
            <h2 className="text-lg font-semibold text-gray-800">
              Recent Transactions
            </h2>
          </div>
        </div>

        <div className="p-4 sm:p-6">
          <TransactionList
            transactions={transactions}
            isLoading={isTransactionsLoading}
            error={transactionsError}
            onRetry={transactionsRefetch}
          />
        </div>

        {/* Pagination */}
        {!isTransactionsLoading && totalPages > 1 && (
          <div className="px-4 sm:px-6 py-4 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <p className="text-sm text-gray-600 text-center sm:text-left">
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

        {/* Empty State */}
        {!isTransactionsLoading && transactions.length === 0 && (
          <div className="text-center py-12">
            <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-4 text-gray-300">
              <CreditCard className="w-full h-full" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No transactions found
            </h3>
            <p className="text-sm sm:text-base text-gray-500 max-w-md mx-auto">
              You haven&apos;t made any transactions yet. Start by making a
              purchase or adding funds to your wallet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
