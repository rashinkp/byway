"use client";

import { useState } from "react";
import { Plus, ArrowDown, ArrowUp, CreditCard } from "lucide-react";
import { createTransaction } from "@/api/transaction";
import { Transaction } from "@/types/transactions";
import { useGetTransactionsByUser } from "@/hooks/transaction/useGetTransactionByUser";
import ErrorDisplay from "@/components/ErrorDisplay";

interface DisplayTransaction {
  id: string;
  type: "deposit" | "withdrawal";
  amount: number;
  date: string;
  time: string;
  description: string;
}

export default function WalletTransactionPage() {

  // Wallet balance state (temporary until wallet API is added)
  const [walletBalance, setWalletBalance] = useState(529.75);

  // Fetch transactions using the hook
  const { data: transactions, isLoading, error: transactionHistoryError, refetch: transactionRefetch } = useGetTransactionsByUser();
  


  // Map backend transactions to display format
  const displayTransactions: DisplayTransaction[] = (transactions || []).map((t: Transaction) => {
    const date = new Date(t.createdAt);
    return {
      id: t.id,
      type: t.type === "PAYMENT" ? "deposit" : "withdrawal", // Map PAYMENT to deposit, REFUND to withdrawal
      amount: t.amount,
      date: date.toISOString().split("T")[0],
      time: date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      description:
        t.type === "PAYMENT" ? "Added funds" : `Refund for order ${t.orderId}`,
    };
  });

  // Add money modal state
  const [showAddMoneyModal, setShowAddMoneyModal] = useState(false);
  const [amountToAdd, setAmountToAdd] = useState("");

  const handleAddMoney = async () => {
    // const amount = parseFloat(amountToAdd);
    // if (isNaN(amount) || amount <= 0) return;

    // try {
    //   // Create transaction via API
    //   await createTransaction({
    //     orderId: `order-${Date.now()}`, // Dummy orderId; replace with actual order ID
    //     userId,
    //     amount,
    //     type: "PAYMENT",
    //     status: "COMPLETED",
    //     description: "Added funds",
    //   });

    //   // Update local balance (temporary until wallet API is added)
    //   setWalletBalance((prev) => prev + amount);

    //   // Reset and close modal
    //   setAmountToAdd("");
    //   setShowAddMoneyModal(false);
    // } catch (error) {
    //   console.error("Failed to add money:", error);
    //   alert("Failed to add money. Please try again.");
    // }
  };




  return (
    <div className="container mx-auto max-w-3xl px-4 py-8 min-h-screen">
      {/* Wallet Card */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">My Wallet</h2>
          <button
            onClick={() => setShowAddMoneyModal(true)}
            className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <Plus size={18} className="mr-2" />
            Add Money
          </button>
        </div>

        <div className="flex flex-col items-center justify-center py-6 bg-gray-50 rounded-md">
          <span className="text-gray-500 text-sm mb-2">Available Balance</span>
          <span className="text-4xl font-bold text-gray-900">
            ${walletBalance.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-6">
          Transaction History
        </h3>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-500">
            <p className="text-lg font-medium">Loading transactions...</p>
          </div>
        ) : transactionHistoryError ? (
          <ErrorDisplay
            onRetry={transactionRefetch}
            error={transactionHistoryError}
            title="transaction error"
          />
        ) : (
          <div className="space-y-4">
            {displayTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center p-4 border border-gray-100 rounded-md hover:bg-gray-50 transition-colors"
              >
                <div
                  className={`h-12 w-12 rounded-full flex items-center justify-center mr-4 ${
                    transaction.type === "deposit"
                      ? "bg-green-100"
                      : "bg-red-100"
                  }`}
                >
                  {transaction.type === "deposit" ? (
                    <ArrowDown size={24} className="text-green-600" />
                  ) : (
                    <ArrowUp size={24} className="text-red-600" />
                  )}
                </div>

                <div className="flex-1">
                  <p className="text-base font-semibold text-gray-800">
                    {transaction.description}
                  </p>
                  <p className="text-sm text-gray-500">
                    {transaction.date} • {transaction.time}
                  </p>
                </div>

                <span
                  className={`text-base font-semibold ${
                    transaction.type === "deposit"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {transaction.type === "deposit" ? "+" : "-"}$
                  {transaction.amount.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Money Modal */}
      {showAddMoneyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Add Money to Wallet
            </h3>

            <div className="mb-6">
              <label
                htmlFor="amount"
                className="block text-gray-700 text-sm font-medium mb-2"
              >
                Amount
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-lg">
                  $
                </span>
                <input
                  id="amount"
                  type="number"
                  value={amountToAdd}
                  onChange={(e) => setAmountToAdd(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            <div className="border border-gray-200 rounded-md p-4 mb-6 flex items-center bg-gray-50">
              <CreditCard size={24} className="text-gray-500 mr-3" />
              <span className="text-gray-800 font-medium">
                •••• •••• •••• 4242
              </span>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={() => setShowAddMoneyModal(false)}
                className="flex-1 py-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 focus:ring-2 focus:ring-gray-500 focus:outline-none"
              >
                Cancel
              </button>
              <button
                onClick={handleAddMoney}
                className="flex-1 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-blue-300 disabled:cursor-not-allowed"
                disabled={!amountToAdd || parseFloat(amountToAdd) <= 0}
              >
                Add Money
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}