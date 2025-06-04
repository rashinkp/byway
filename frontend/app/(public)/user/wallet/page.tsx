"use client";
import { useState } from "react";
import { Plus, CreditCard, Wallet, History, ArrowUpRight, ArrowDownLeft, Loader2 } from "lucide-react";
import { useGetTransactionsByUser } from "@/hooks/transaction/useGetTransactionByUser";
import { useWallet } from "@/hooks/wallet/useWallet";
import { useStripe } from "@/hooks/stripe/useStripe";
import { TransactionList } from "@/components/transactions/TransactionList";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/auth/useAuth";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

type PaymentGateway = "stripe" | "razorpay";

export default function WalletTransactionPage() {
  const { user } = useAuth();
  const { createStripeCheckoutSession } = useStripe();
  
  // Use the wallet hook to get real wallet data
  const {
    wallet,
    isLoading: isWalletLoading,
    error: walletError,
    refetch: walletRefetch,
  } = useWallet();

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
  const [selectedGateway, setSelectedGateway] = useState<PaymentGateway>("stripe");
  const [showGatewaySelection, setShowGatewaySelection] = useState(false);

  const handleAddMoney = async () => {
    const amount = parseFloat(amountToAdd);
    if (isNaN(amount) || amount <= 0) {
      setAddMoneyError("Please enter a valid amount greater than 0.");
      return;
    }

    if (!user?.id) {
      setAddMoneyError("Please login to add money to your wallet.");
      return;
    }

    // Show gateway selection if not already shown
    if (!showGatewaySelection) {
      setShowGatewaySelection(true);
      return;
    }

    setIsAddingMoney(true);
    setAddMoneyError(null);

    try {
      if (selectedGateway === "stripe") {
        // Create Stripe checkout session for wallet top-up
        const response = await createStripeCheckoutSession({
          userId: user.id,
          amount,
          isWalletTopUp: true
        });

        if (response.success && response.data.session.url) {
          // Redirect to Stripe checkout
          window.location.href = response.data.session.url;
        } else {
          throw new Error("Failed to create checkout session");
        }
      } else if (selectedGateway === "razorpay") {
        // TODO: Implement Razorpay integration
        throw new Error("Razorpay integration coming soon");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to add money. Please try again.";
      setAddMoneyError(errorMessage);
    } finally {
      setIsAddingMoney(false);
    }
  };

  const handleBack = () => {
    if (showGatewaySelection) {
      setShowGatewaySelection(false);
    } else {
      setShowAddMoneyModal(false);
      setAmountToAdd("");
      setAddMoneyError(null);
    }
  };

  if (isWalletLoading) {
    return (
      <div className="min-h-screen bg-gray-50/50 p-6 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (walletError) {
    return (
      <div className="min-h-screen bg-gray-50/50 p-6 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Failed to load wallet data</p>
          <Button 
            onClick={() => walletRefetch()}
            variant="outline"
            className="bg-blue-50 text-blue-700 border-blue-200"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

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
              <p className="text-3xl font-bold text-gray-900">${wallet?.balance.toFixed(2) ?? "0.00"}</p>
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

        
      </div>

      {/* Add Money Modal */}
      {showAddMoneyModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md bg-white/95 backdrop-blur-sm border border-gray-100 shadow-xl">
            <div className="p-6">
              <div className="flex items-center gap-2 text-gray-900 mb-6">
                <Plus className="w-5 h-5" />
                <h3 className="text-lg font-semibold">
                  {showGatewaySelection ? "Select Payment Method" : "Add Money to Wallet"}
                </h3>
              </div>
              <Separator className="mb-6" />
              <div className="space-y-6">
                {!showGatewaySelection ? (
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
                ) : (
                  <div className="space-y-4">
                    <RadioGroup
                      value={selectedGateway}
                      onValueChange={(value) => setSelectedGateway(value as PaymentGateway)}
                      className="space-y-3"
                    >
                      <div className="flex items-center space-x-2 rounded-lg border p-4 hover:bg-gray-50 cursor-pointer">
                        <RadioGroupItem value="stripe" id="stripe" />
                        <Label htmlFor="stripe" className="flex items-center gap-2 cursor-pointer">
                          <CreditCard className="w-5 h-5 text-blue-600" />
                          <span>Credit/Debit Card (Stripe)</span>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 rounded-lg border p-4 hover:bg-gray-50 cursor-pointer">
                        <RadioGroupItem value="razorpay" id="razorpay" />
                        <Label htmlFor="razorpay" className="flex items-center gap-2 cursor-pointer">
                          <CreditCard className="w-5 h-5 text-purple-600" />
                          <span>UPI/Card (Razorpay)</span>
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                )}

                <div className="flex gap-4">
                  <Button
                    onClick={handleBack}
                    variant="outline"
                    className="flex-1 bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                    disabled={isAddingMoney}
                  >
                    {showGatewaySelection ? "Back" : "Cancel"}
                  </Button>
                  <Button
                    onClick={handleAddMoney}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                    disabled={
                      isAddingMoney || 
                      (!showGatewaySelection && (!amountToAdd || parseFloat(amountToAdd) <= 0))
                    }
                  >
                    {isAddingMoney ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : showGatewaySelection ? (
                      "Continue to Payment"
                    ) : (
                      "Continue"
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