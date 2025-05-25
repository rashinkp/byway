import { ArrowDown, ArrowUp, Wallet } from "lucide-react";
import { Transaction } from "@/types/transactions";
import ErrorDisplay from "@/components/ErrorDisplay";

interface DisplayTransaction {
  id: string;
  type: "deposit" | "withdrawal";
  amount: number;
  date: string;
  time: string;
  description: string;
}

interface TransactionListProps {
  transactions: Transaction[] | undefined;
  isLoading: boolean;
  error: Error | null;
  onRetry: () => void;
}

export function TransactionList({ transactions, isLoading, error, onRetry }: TransactionListProps) {
  const displayTransactions: DisplayTransaction[] = (transactions || []).map(
    (t: Transaction) => {
      const date = new Date(t.createdAt);
      let description = t.description || "Transaction";
      if (t.type === "DEPOSIT") description = "Funds added to wallet";
      else if (t.type === "WITHDRAWAL") description = "Funds withdrawn";
      else if (t.type === "PURCHASE") description = "Course purchase";
      else if (t.type === "REFUND") description = `Refund for order ${t.orderId}`;
      else if (t.type === "PAYMENT") description = "Payment for course";

      return {
        id: t.id,
        type:
          t.type === "DEPOSIT" || t.type === "REFUND" 
            ? "deposit"
            : "withdrawal",
        amount: typeof t.amount === "string" ? parseFloat(t.amount) : t.amount,
        date: date.toISOString().split("T")[0],
        time: date.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        description,
      };
    }
  );

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-gray-600">
        <p className="text-xl font-medium">Loading your transactions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <ErrorDisplay
        error={error}
        onRetry={onRetry}
        title="Unable to Load Transactions"
        description="We encountered an issue fetching your transaction history. Please try again."
      />
    );
  }

  if (displayTransactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-gray-600">
        <Wallet
          size={56}
          className="text-gray-400 mb-4"
          aria-hidden="true"
        />
        <p className="text-xl font-medium">No Transactions Yet</p>
        <p className="text-base text-gray-500 mt-2 text-center">
          Your wallet is ready to go! Add funds or make a purchase to see
          your transactions here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {displayTransactions.map((transaction) => (
        <div
          key={transaction.id}
          className="flex items-center p-5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <div
            className={`h-14 w-14 rounded-full flex items-center justify-center mr-5 ${
              transaction.type === "deposit"
                ? "bg-green-100"
                : "bg-red-100"
            }`}
          >
            {transaction.type === "deposit" ? (
              <ArrowDown size={28} className="text-green-600" />
            ) : (
              <ArrowUp size={28} className="text-red-600" />
            )}
          </div>
          <div className="flex-1">
            <p className="text-lg font-semibold text-gray-900">
              {transaction.description}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {transaction.date} • {transaction.time}
            </p>
          </div>
          <span
            className={`text-lg font-semibold ${
              transaction.type === "deposit"
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {transaction.type === "deposit" ? "+" : "-"}$
            {typeof transaction.amount === "number" &&
            !isNaN(transaction.amount)
              ? transaction.amount.toFixed(2)
              : "0.00"}
          </span>
        </div>
      ))}
    </div>
  );
} 