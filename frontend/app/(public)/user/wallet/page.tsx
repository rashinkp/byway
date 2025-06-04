"use client";
import { useState } from "react";
import { Plus, CreditCard, Wallet, History, ArrowUpRight, ArrowDownLeft, Loader2 } from "lucide-react";
import { useGetTransactionsByUser } from "@/hooks/transaction/useGetTransactionByUser";
import { TransactionList } from "@/components/transactions/TransactionList";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

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
    <div className="min-h-screen bg-gray-50/50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Wallet Overview Card */}
        <Card className="bg-white/80 backdrop-blur-sm border border-gray-100 shadow-sm rounded-xl p-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg">
                  <Wallet className="w-8 h-8" />
                </div>
              </div>
              <div className="space-y-2">
                <h1 className="text-2xl font-semibold text-gray-900">My Wallet</h1>
                <div className="flex items-center gap-3">
                  <Badge 
                    variant="outline"
                    className="bg-green-50 text-green-700 border-green-200"
                  >
                    <ArrowUpRight className="w-3 h-3 mr-1" />
                    Active
                  </Badge>
                  <Badge 
                    variant="outline"
                    className="bg-blue-50 text-blue-700 border-blue-200"
                  >
                    <CreditCard className="w-3 h-3 mr-1" />
                    Card Linked
                  </Badge>
                </div>
              </div>
            </div>
            <Button 
              onClick={() => setShowAddMoneyModal(true)}
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg transition-all duration-200 hover:shadow-xl"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Money
            </Button>
          </div>

          <Separator className="my-6" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Wallet className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Available Balance</h3>
              </div>
              <p className="text-3xl font-bold text-gray-900">${walletBalance.toFixed(2)}</p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-green-100 p-2 rounded-lg">
                  <ArrowUpRight className="w-5 h-5 text-green-600" />
                </div>
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Total Deposits</h3>
              </div>
              <p className="text-3xl font-bold text-gray-900">$1,250.00</p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-purple-100 p-2 rounded-lg">
                  <ArrowDownLeft className="w-5 h-5 text-purple-600" />
                </div>
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Total Spent</h3>
              </div>
              <p className="text-3xl font-bold text-gray-900">$720.25</p>
            </div>
          </div>
        </Card>

        {/* Transaction History */}
        {/* <Card className="bg-white/80 backdrop-blur-sm border border-gray-100 shadow-sm rounded-xl overflow-hidden">
          <div className="p-6">
            <div className="flex items-center gap-2 text-gray-900 mb-6">
              <History className="w-5 h-5" />
              <h2 className="text-lg font-semibold">Transaction History</h2>
            </div>
            <Separator className="mb-6" />
            {isTransactionsLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
              </div>
            ) : transactionsError ? (
              <div className="text-center py-8">
                <p className="text-red-600 mb-4">Failed to load transactions</p>
                <Button 
                  onClick={() => transactionsRefetch()}
                  variant="outline"
                  className="bg-blue-50 text-blue-700 border-blue-200"
                >
                  Try Again
                </Button>
              </div>
            ) : (
              <TransactionList
                transactions={transactions ?? []}
                isLoading={isTransactionsLoading}
                error={transactionsError}
                onRetry={transactionsRefetch}
              />
            )}
          </div>
        </Card> */}
      </div>

      {/* Add Money Modal */}
      {showAddMoneyModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md bg-white/95 backdrop-blur-sm border border-gray-100 shadow-xl">
            <div className="p-6">
              <div className="flex items-center gap-2 text-gray-900 mb-6">
                <Plus className="w-5 h-5" />
                <h3 className="text-lg font-semibold">Add Money to Wallet</h3>
              </div>
              <Separator className="mb-6" />
              <div className="space-y-6">
                <div>
                  <label
                    htmlFor="amount"
                    className="block text-sm font-medium text-gray-700 mb-2"
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
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 text-base"
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

                <div className="bg-gray-50 rounded-lg p-4 flex items-center border border-gray-200">
                  <CreditCard className="w-5 h-5 text-gray-600 mr-3" />
                  <span className="text-gray-900 font-medium">
                    •••• •••• •••• 4242
                  </span>
                </div>

                <div className="flex gap-4">
                  <Button
                    onClick={() => {
                      setShowAddMoneyModal(false);
                      setAddMoneyError(null);
                    }}
                    variant="outline"
                    className="flex-1 bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                    disabled={isAddingMoney}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleAddMoney}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                    disabled={
                      isAddingMoney || !amountToAdd || parseFloat(amountToAdd) <= 0
                    }
                  >
                    {isAddingMoney ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Adding...
                      </>
                    ) : (
                      "Add Money"
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}