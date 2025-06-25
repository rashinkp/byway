"use client";

import React, { useState } from "react";
import { useWallet } from "@/hooks/wallet/useWallet";
import { useWalletTopUp } from "@/hooks/wallet/useWalletTopUp";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Wallet,
  CreditCard,
  AlertCircle,
  Plus,
  DollarSign,
  TrendingUp,
  Shield,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { toast } from "sonner";
import ErrorDisplay from "@/components/ErrorDisplay";
import { Skeleton } from "@/components/ui/skeleton";

export default function WalletSection() {
  const { wallet, isLoading: walletLoading, error: walletError, refetch: refetchWallet } = useWallet();
  const { mutate: topUpWallet, isPending: isToppingUp } = useWalletTopUp();
  const [amount, setAmount] = useState<string>("");
  const [showTopUpForm, setShowTopUpForm] = useState(false);

  const handleTopUp = () => {
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    if (numericAmount < 1) {
      toast.error("Minimum top-up amount is $1.00");
      return;
    }

    topUpWallet({
      amount: numericAmount,
      paymentMethod: "STRIPE",
    });
  };

  const quickAmounts = [10, 25, 50, 100];

  if (walletError) {
    return <ErrorDisplay error={walletError} onRetry={refetchWallet} title="Wallet Error" description="There was a problem loading your wallet. Please try again." />;
  }

  if (walletLoading) {
    return (
      <div className="w-full space-y-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="space-y-4">
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      {/* Header Section */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
              Wallet
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              Manage your wallet balance and transactions
            </p>
          </div>
          <Button
            onClick={() => setShowTopUpForm(!showTopUpForm)}
            className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 w-full sm:w-auto"
          >
            <Plus className="w-4 h-4" />
            Add Funds
          </Button>
        </div>
      </div>

      {/* Balance Card */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-6 sm:p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 opacity-10">
          <Wallet className="w-32 h-32 sm:w-48 sm:h-48" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-white/20 p-2 rounded-lg">
              <Wallet className="w-6 h-6" />
            </div>
            <div>
              <p className="text-blue-100 text-sm font-medium">
                Current Balance
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold">
                ${wallet?.balance?.toFixed(2) || "0.00"}
              </h2>
            </div>
          </div>
          <div className="flex items-center gap-2 text-blue-100 text-sm">
            <Shield className="w-4 h-4" />
            <span>Secured & Protected</span>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">
                Available Balance
              </p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">
                ${wallet?.balance?.toFixed(2) || "0.00"}
              </p>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

       

        <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 sm:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Status</p>
              <p className="text-xl sm:text-2xl font-bold text-green-600">
                Active
              </p>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <Zap className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Top Up Form */}
      {showTopUpForm && (
        <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center gap-2 mb-6">
            <CreditCard className="w-5 h-5 text-gray-700" />
            <h2 className="text-lg font-semibold text-gray-800">
              Add Funds to Wallet
            </h2>
          </div>

          <div className="space-y-6">
            {/* Quick Amount Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Quick Select Amount
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {quickAmounts.map((quickAmount) => (
                  <Button
                    key={quickAmount}
                    variant="outline"
                    onClick={() => setAmount(quickAmount.toString())}
                    className={`h-12 ${
                      amount === quickAmount.toString()
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "hover:border-gray-300"
                    }`}
                  >
                    ${quickAmount}
                  </Button>
                ))}
              </div>
            </div>

            {/* Custom Amount Input */}
            <div>
              <label
                htmlFor="amount"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Or Enter Custom Amount
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  id="amount"
                  type="number"
                  min="1"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="pl-10 h-12 text-lg"
                  placeholder="0.00"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Minimum amount: $1.00
              </p>
            </div>

            {/* Payment Method Info */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-start gap-3">
                <div className="bg-blue-50 p-2 rounded-lg">
                  <Shield className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">
                    Secure Payment
                  </h4>
                  <p className="text-sm text-gray-600">
                    Payments are processed securely through Stripe. Your payment
                    information is encrypted and protected.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={handleTopUp}
                disabled={isToppingUp || !amount || parseFloat(amount) < 1}
                className="flex-1 h-12 bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isToppingUp ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processing...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4" />
                    Add ${amount || "0.00"} to Wallet
                  </div>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowTopUpForm(false);
                  setAmount("");
                }}
                className="sm:w-auto h-12"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Information Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 sm:p-6">
          <div className="flex items-start gap-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <ArrowUpRight className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">
                How to Use Your Wallet
              </h3>
              <p className="text-sm text-blue-700 leading-relaxed">
                Use your wallet balance to purchase courses, premium features,
                or other services on our platform. Funds are instantly available
                after adding them.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-xl p-4 sm:p-6">
          <div className="flex items-start gap-3">
            <div className="bg-green-100 p-2 rounded-lg">
              <ArrowDownRight className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-green-900 mb-2">
                Secure & Protected
              </h3>
              <p className="text-sm text-green-700 leading-relaxed">
                Your wallet is protected with bank-level security. All
                transactions are encrypted and monitored for suspicious
                activity.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
