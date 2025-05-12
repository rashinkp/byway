"use client";

import { useState } from "react";
import { Plus, ArrowDown, ArrowUp, CreditCard } from "lucide-react";

export default function WalletTransactionPage() {
  // Wallet balance state
  const [walletBalance, setWalletBalance] = useState(529.75);

  // Transaction data state
  const [transactions, setTransactions] = useState([
    {
      id: 1,
      type: "deposit",
      amount: 100.0,
      date: "2025-05-10",
      description: "Added funds",
      time: "14:32",
    },
    {
      id: 2,
      type: "withdrawal",
      amount: 45.25,
      date: "2025-05-09",
      description: "Coffee shop",
      time: "09:15",
    },
    {
      id: 3,
      type: "deposit",
      amount: 500.0,
      date: "2025-05-05",
      description: "Salary deposit",
      time: "00:01",
    },
    {
      id: 4,
      type: "withdrawal",
      amount: 125.0,
      date: "2025-05-03",
      description: "Grocery shopping",
      time: "17:45",
    },
  ]);

  // Add money modal state
  const [showAddMoneyModal, setShowAddMoneyModal] = useState(false);
  const [amountToAdd, setAmountToAdd] = useState("");

  const handleAddMoney = () => {
    const amount = parseFloat(amountToAdd);
    if (isNaN(amount) || amount <= 0) return;

    // Update wallet balance
    setWalletBalance((prev) => prev + amount);

    // Add new transaction
    const newTransaction = {
      id: transactions.length + 1,
      type: "deposit",
      amount,
      date: new Date().toISOString().split("T")[0],
      description: "Added funds",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setTransactions([newTransaction, ...transactions]);

    // Reset and close modal
    setAmountToAdd("");
    setShowAddMoneyModal(false);
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

        {transactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-500">
            <p className="text-lg font-medium">No transactions yet</p>
            <p className="text-sm">Your transactions will appear here</p>
          </div>
        ) : (
          <div className="space-y-4">
            {transactions.map((transaction) => (
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
