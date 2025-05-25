"use client";
import { useState } from "react";
import { Plus, CreditCard } from "lucide-react";
import { useGetTransactionsByUser } from "@/hooks/transaction/useGetTransactionByUser";
import { TransactionList } from "@/components/transactions/TransactionList";

export default function WalletTransactionPage() {
  // Dummy wallet balance state
  const [walletBalance, setWalletBalance] = useState(529.75);

  // Fetch transactions using the hook
  const {
    data: transactions,
    isLoading: isTransactionsLoading,
    error: transactionsError,
    refetch: transactionsRefetch,
  } = useGetTransactionsByUser();

  // Add money modal state
  const [showAddMoneyModal, setShowAddMoneyModal] = useState(false);
  const [amountToAdd, setAmountToAdd] = useState("");
  const [isAddingMoney, setIsAddingMoney] = useState(false);
  const [addMoneyError, setAddMoneyError] = useState<string | null>(null);

  const handleAddMoney = async () => {
    const amount = parseFloat(amountToAdd);
    if (isNaN(amount) || amount <= 0) {
      setAddMoneyError("Please enter a valid amount greater than 0.");
      return;
    }

    setIsAddingMoney(true);
    setAddMoneyError(null);

    try {
      // Create transaction via API
      // await createTransaction({
      //   orderId: `order-${Date.now()}`, // Dummy orderId; replace with actual order ID
      //   userId,
      //   walletId: "dummy-wallet-id", // Dummy walletId; replace with actual wallet ID
      //   amount,
      //   type: "DEPOSIT",
      //   status: "COMPLETED",
      //   description: "Funds added to wallet",
      // });

      // Update dummy wallet balance
      setWalletBalance((prev) => prev + amount);

      // Refetch transactions
      await transactionsRefetch();

      // Reset and close modal
      setAmountToAdd("");
      setShowAddMoneyModal(false);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to add money. Please try again.";
      setAddMoneyError(errorMessage);
    } finally {
      setIsAddingMoney(false);
    }
  };

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8 min-h-screen">
      {/* Wallet Card */}
      <div className="bg-white rounded-lg shadow-sm p-8 mb-10">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">My Wallet</h2>
          <button
            onClick={() => setShowAddMoneyModal(true)}
            className="flex items-center bg-blue-600 text-white px-5 py-2.5 rounded-md text-sm font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors"
            aria-label="Add money to wallet"
          >
            <Plus size={20} className="mr-2" />
            Add Money
          </button>
        </div>
        <div className="flex flex-col items-center justify-center py-8 bg-gray-50 rounded-lg">
          <span className="text-gray-600 text-base mb-3 font-medium">
            Available Balance
          </span>
          <span className="text-5xl font-bold text-gray-900">
            ${walletBalance.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-white rounded-lg shadow-sm p-8">
        <h3 className="text-2xl font-semibold text-gray-900 mb-8">
          Transaction History
        </h3>
        <TransactionList
          transactions={transactions}
          isLoading={isTransactionsLoading}
          error={transactionsError}
          onRetry={transactionsRefetch}
        />
      </div>

      {/* Add Money Modal */}
      {showAddMoneyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-8 w-full max-w-md shadow-lg">
            <h3 className="text-2xl font-semibold text-gray-900 mb-6">
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
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 text-lg">
                  $
                </span>
                <input
                  id="amount"
                  type="number"
                  value={amountToAdd}
                  onChange={(e) => setAmountToAdd(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 text-base"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  aria-invalid={!!addMoneyError}
                  aria-describedby={addMoneyError ? "amount-error" : undefined}
                />
                {addMoneyError && (
                  <p
                    id="amount-error"
                    className="text-red-600 text-sm mt-2"
                    role="alert"
                  >
                    {addMoneyError}
                  </p>
                )}
              </div>
            </div>
            <div className="border border-gray-200 rounded-md p-4 mb-6 flex items-center bg-gray-50">
              <CreditCard size={24} className="text-gray-600 mr-3" />
              <span className="text-gray-900 font-medium">
                •••• •••• •••• 4242
              </span>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => {
                  setShowAddMoneyModal(false);
                  setAddMoneyError(null);
                }}
                className="flex-1 py-3 border border-gray-300 rounded-md text-gray-700 text-base font-medium hover:bg-gray-100 focus:ring-2 focus:ring-gray-500 focus:outline-none disabled:bg-gray-200 disabled:cursor-not-allowed"
                disabled={isAddingMoney}
                aria-label="Cancel adding money"
              >
                Cancel
              </button>
              <button
                onClick={handleAddMoney}
                className="flex-1 py-3 bg-blue-600 text-white rounded-md text-base font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-blue-300 disabled:cursor-not-allowed"
                disabled={
                  isAddingMoney || !amountToAdd || parseFloat(amountToAdd) <= 0
                }
                aria-label="Add money to wallet"
              >
                {isAddingMoney ? "Adding..." : "Add Money"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}