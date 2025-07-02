import React from "react";
import { Transaction } from "@/types/transaction";
import { ArrowUp, ArrowDown, AlertCircle, RefreshCw } from "lucide-react";
import { formatDate, formatPrice } from "@/utils/formatters";
import { Skeleton } from "@/components/ui/skeleton";

interface TransactionListProps {
  transactions: Transaction[];
  isLoading: boolean;
  error?: any;
  onRetry?: () => void;
  onRetryTransaction?: (transaction: Transaction) => void;
}

export const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
  isLoading,
  error,
  onRetry,
  onRetryTransaction,
}) => {
  const getStatusInfo = (transaction: Transaction) => {
    const { status, type } = transaction;

    if (type === "WALLET_TOPUP") {
      switch (status) {
        case "COMPLETED":
          return {
            icon: <ArrowUp className="h-5 w-5 text-[var(--color-primary-dark)]" />,
            bgColor: "bg-green-100",
            textColor: "text-green-600",
            label: "Wallet Top-up",
            amountPrefix: "+",
          };
        case "FAILED":
          return {
            icon: <AlertCircle className="h-5 w-5 text-[var(--color-primary-dark)]" />,
            bgColor: "bg-red-100",
            textColor: "text-red-600",
            label: transaction.failureReason || "Top-up Failed",
            amountPrefix: "",
          };
        case "PENDING":
          return {
            icon: <AlertCircle className="h-5 w-5 text-[var(--color-primary-dark)]" />,
            bgColor: "bg-yellow-100",
            textColor: "text-yellow-600",
            label: "Top-up Pending",
            amountPrefix: "",
          };
        default:
          return {
            icon: <AlertCircle className="h-5 w-5 text-[var(--color-primary-dark)]" />,
            bgColor: "bg-gray-100",
            textColor: "text-gray-600",
            label: "Unknown Status",
            amountPrefix: "",
          };
      }
    }

    if (type === "PURCHASE") {
      switch (status) {
        case "COMPLETED":
          return {
            icon: <ArrowUp className="h-5 w-5 text-[var(--color-primary-dark)]" />,
            bgColor: "bg-red-100",
            textColor: "text-red-600",
            label: "Purchase Completed",
            amountPrefix: "-",
          };
        case "FAILED":
          return {
            icon: <AlertCircle className="h-5 w-5 text-[var(--color-primary-dark)]" />,
            bgColor: "bg-red-100",
            textColor: "text-red-600",
            label: transaction.failureReason || "Payment Failed",
            amountPrefix: "",
          };
        case "PENDING":
          return {
            icon: <AlertCircle className="h-5 w-5 text-[var(--color-primary-dark)]" />,
            bgColor: "bg-yellow-100",
            textColor: "text-yellow-600",
            label: "Purchase Pending",
            amountPrefix: "",
          };
        default:
          return {
            icon: <AlertCircle className="h-5 w-5 text-[var(--color-primary-dark)]" />,
            bgColor: "bg-gray-100",
            textColor: "text-gray-600",
            label: "Unknown Status",
            amountPrefix: "",
          };
      }
    }

    switch (status) {
      case "COMPLETED":
        return {
          icon: <ArrowDown className="h-5 w-5 text-[var(--color-primary-dark)]" />,
          bgColor: "bg-green-100",
          textColor: "text-green-600",
          label: "Payment Received",
          amountPrefix: "+",
        };
      case "FAILED":
        return {
          icon: <AlertCircle className="h-5 w-5 text-[var(--color-primary-dark)]" />,
          bgColor: "bg-red-100",
          textColor: "text-red-600",
          label: transaction.failureReason || "Payment Failed",
          amountPrefix: "",
        };
      case "PENDING":
        return {
          icon: <AlertCircle className="h-5 w-5 text-[var(--color-primary-dark)]" />,
          bgColor: "bg-yellow-100",
          textColor: "text-yellow-600",
          label: "Payment Pending",
          amountPrefix: "",
        };
      default:
        return {
          icon: <AlertCircle className="h-5 w-5 text-[var(--color-primary-dark)]" />,
          bgColor: "bg-gray-100",
          textColor: "text-gray-600",
          label: "Unknown Status",
          amountPrefix: "",
        };
    }
  };

  if (isLoading) {
    return (
      <div className="py-8 space-y-3">
        {[1,2,3,4,5].map(i => (
          <Skeleton key={i} className="h-16 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (!transactions?.length) {
    return (
      <div className="text-center py-8 text-[var(--color-muted)]">
        <AlertCircle className="w-12 h-12 mx-auto mb-4 text-[var(--color-muted)]" />
        <p className="text-lg font-medium">No Transactions Yet</p>
        <p className="text-sm mt-2">Your transaction history will appear here</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {transactions.map((transaction) => {
        const statusInfo = getStatusInfo(transaction);
        return (
          <div
            key={transaction.id}
            className="flex items-center p-4 bg-[var(--color-background)] rounded-lg transition-colors"
          >
            <div className={`h-10 w-10 rounded-full flex items-center justify-center mr-4 ${statusInfo.bgColor}`}>
              {statusInfo.icon}
            </div>

            <div className="flex-1">
              <p className="text-sm font-medium text-[var(--color-primary-dark)]">
                {statusInfo.label}
                {transaction.courseId && (
                  <span className="text-xs text-[var(--color-muted)] ml-2">
                    (Course: {transaction.courseId})
                  </span>
                )}
              </p>
              <p className="text-sm text-[var(--color-muted)]">
                {formatDate(transaction.createdAt)}
              </p>
            </div>

            <div className="text-right">
              <p className={`text-lg font-semibold ${statusInfo.textColor}`}>
                {statusInfo.amountPrefix}{formatPrice(transaction.amount)}
              </p>
              <p className="text-sm text-[var(--color-muted)]">
                {transaction.paymentGateway || "Unknown Gateway"}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
