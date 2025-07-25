"use client";

import React, { useState } from "react";
import { useWallet } from "@/hooks/wallet/useWallet";
import { useWalletTopUp } from "@/hooks/wallet/useWalletTopUp";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Wallet,
	ArrowUpRight,
	ArrowDownRight,
} from "lucide-react";
import { toast } from "sonner";
import ErrorDisplay from "@/components/ErrorDisplay";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

export default function WalletSection() {
	const {
		wallet,
		isLoading: walletLoading,
		error: walletError,
		refetch: refetchWallet,
	} = useWallet();
	const { mutate: topUpWallet, isPending: isToppingUp } = useWalletTopUp();
	const [amount, setAmount] = useState<string>("");
	const [showTopUpModal, setShowTopUpModal] = useState(false);

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
		setShowTopUpModal(false);
		setAmount("");
	};

	if (walletError) {
		return (
			<ErrorDisplay
				error={walletError}
				onRetry={refetchWallet}
				title="Wallet Error"
				description="There was a problem loading your wallet. Please try again."
			/>
		);
	}

	if (walletLoading) {
		return (
			<div className="w-full space-y-6">
				<div className="bg-white dark:bg-[#232326] rounded-xl  p-6">
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
			<div className="bg-white/80 dark:bg-[#232323] rounded-xl p-8 mb-8 text-center border border-gray-200 dark:border-gray-700">
				<h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">Wallet</h1>
				<p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
					Manage your wallet balance and transactions.
				</p>
			</div>

			{/* Balance Card */}
			<div className="bg-gradient-to-br from-yellow-400 to-yellow-200 dark:from-yellow-600 dark:to-yellow-400 rounded-xl p-6 sm:p-8 text-gray-900 dark:text-[#18181b] relative overflow-hidden border border-gray-200 dark:border-gray-700">
				<div className="absolute top-0 right-0 opacity-10">
					<Wallet className="w-32 h-32 sm:w-48 sm:h-48" />
				</div>
				<div className="relative z-10">
					<div className="flex items-center gap-3 mb-4">
						<div className="bg-white dark:bg-yellow-200 p-2 rounded-lg">
							<Wallet className="w-6 h-6 text-yellow-500 dark:text-[#facc15]" />
						</div>
						<div>
							<p className="text-gray-700 text-sm font-medium">
								Current Balance
							</p>
							<h2 className="text-3xl sm:text-4xl font-bold dark:text-[#facc15]">
								${wallet?.balance?.toFixed(2) || "0.00"}
							</h2>
						</div>
					</div>
					<Button
						onClick={() => setShowTopUpModal(true)}
						className="bg-[#facc15] hover:bg-yellow-600 text-black font-semibold px-6 py-2 rounded-lg shadow-md dark:bg-[#facc15] dark:hover:bg-yellow-400 dark:text-[#18181b]"
					>
						Add Money
					</Button>
				</div>
			</div>

			<Dialog open={showTopUpModal} onOpenChange={setShowTopUpModal}>
				<DialogContent className="bg-white dark:bg-[#232323] rounded-xl p-6 border border-gray-200 dark:border-gray-700">
					<DialogHeader>
						<DialogTitle>Add Money to Wallet</DialogTitle>
					</DialogHeader>
					<div className="space-y-4">
						<label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Amount</label>
						<Input
							id="amount"
							type="number"
							min="1"
							step="0.01"
							value={amount}
							onChange={(e) => setAmount(e.target.value)}
							placeholder="Enter amount"
						/>
					</div>
					<DialogFooter>
						<Button
							onClick={handleTopUp}
							disabled={isToppingUp || !amount || parseFloat(amount) < 1}
							className="bg-[#facc15] hover:bg-yellow-600 text-black font-semibold dark:bg-[#facc15] dark:hover:bg-yellow-400 dark:text-[#18181b]"
						>
							{isToppingUp ? "Processing..." : "Add Money"}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Information Boxes */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
				<div className="bg-white/80 dark:bg-[#232323] border border-gray-200 dark:border-gray-700 rounded-xl p-6">
					<div className="flex items-start gap-3">
						<div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-lg">
							<ArrowUpRight className="w-5 h-5 text-yellow-500 dark:text-[#facc15]" />
						</div>
						<div>
							<h3 className="font-semibold text-gray-900 dark:text-white mb-2">
								How to Use Your Wallet
							</h3>
							<p className="text-sm text-gray-500 dark:text-gray-300 leading-relaxed">
								Use your wallet balance to purchase courses, premium features, or other services on our platform. Funds are instantly available after adding them.
							</p>
						</div>
					</div>
				</div>
				<div className="bg-white/80 dark:bg-[#232323] border border-gray-200 dark:border-gray-700 rounded-xl p-6">
					<div className="flex items-start gap-3">
						<div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-lg">
							<ArrowDownRight className="w-5 h-5 text-yellow-500 dark:text-[#facc15]" />
						</div>
						<div>
							<h3 className="font-semibold text-gray-900 dark:text-white mb-2">
								Secure & Protected
							</h3>
							<p className="text-sm text-gray-500 dark:text-gray-300 leading-relaxed">
								Your wallet is protected with bank-level security. All transactions are encrypted and monitored for suspicious activity.
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
