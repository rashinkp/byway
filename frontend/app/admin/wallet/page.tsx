"use client";

import { useState } from "react";
import { useWallet } from "@/hooks/wallet/useWallet";
import { useWalletTopUp } from "@/hooks/wallet/useWalletTopUp";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Wallet, CreditCard, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { TransactionList } from "@/components/transactions/TransactionList";
import { useGetTransactionsByUser } from "@/hooks/transaction/useGetTransactionByUser";
import { LoadingSpinner } from "@/components/admin";

export default function AdminWalletPage() {
	const { wallet, isLoading: walletLoading } = useWallet();
	const { mutate: topUpWallet, isPending: isToppingUp } = useWalletTopUp();
	const [amount, setAmount] = useState<string>("");
	const {
		data: transactions,
		isLoading: isTransactionsLoading,
		error: transactionsError,
		refetch: transactionsRefetch,
	} = useGetTransactionsByUser();

	const handleTopUp = () => {
		const numericAmount = parseFloat(amount);
		if (isNaN(numericAmount) || numericAmount <= 0) {
			toast.error("Please enter a valid amount");
			return;
		}

		topUpWallet({
			amount: numericAmount,
			paymentMethod: "STRIPE",
		});
	};

	if (walletLoading) {
		return <LoadingSpinner />
	}

	return (
		<div className="container mx-auto px-4 py-8">
			<div className="max-w-2xl mx-auto space-y-6">
				<Card className="p-6 bg-white/80 dark:bg-[#232323] border border-gray-200 dark:border-gray-700">
					<div className="flex items-center gap-4 mb-6">
						<Wallet className="h-8 w-8 text-[#facc15] dark:text-[#facc15]" />
						<div>
							<h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Wallet</h1>
							<p className="text-gray-600 dark:text-gray-300">Manage your wallet balance</p>
						</div>
					</div>

					<div className="bg-gray-50 p-4 rounded-lg mb-6 dark:bg-[#18181b]">
						<p className="text-sm text-gray-600 dark:text-gray-300 mb-1">Current Balance</p>
						<p className="text-3xl font-bold text-black dark:text-[#facc15]">
							${wallet?.balance.toFixed(2) || "0.00"}
						</p>
					</div>

					<div className="space-y-4">
						<div>
							<label
								htmlFor="amount"
								className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
							>
								Top Up Amount
							</label>
							<div className="relative">
								<span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-300">
									$
								</span>
								<Input
									id="amount"
									type="number"
									min="0"
									step="0.01"
									value={amount}
									onChange={(e) => setAmount(e.target.value)}
									className="pl-8"
									placeholder="Enter amount"
								/>
							</div>
						</div>

						<Button
							onClick={handleTopUp}
							disabled={isToppingUp || !amount}
							className="w-full bg-[#facc15] hover:bg-yellow-600 text-black font-semibold dark:bg-[#facc15] dark:hover:bg-yellow-400 dark:text-[#18181b]"
						>
							{isToppingUp ? (
								<div className="flex items-center gap-2">
									<CreditCard className="h-4 w-4 animate-spin" />
									Processing...
								</div>
							) : (
								<div className="flex items-center gap-2">
									<CreditCard className="h-4 w-4" />
									Top Up Wallet
								</div>
							)}
						</Button>

						<div className="bg-blue-50 dark:bg-gray-500 p-4 rounded-lg flex items-start gap-3">
							<AlertCircle className="h-5 w-5 text-[#facc15] flex-shrink-0 mt-0.5" />
							<p className="text-sm text-[#facc15]">
								Your wallet balance can be used to purchase courses or other services on our platform.
							</p>
						</div>
					</div>
				</Card>

				<TransactionList
					transactions={transactions?.items ?? []}
					isLoading={isTransactionsLoading}
					error={transactionsError}
					onRetry={transactionsRefetch}
				/>
			</div>
		</div>
	);
}
