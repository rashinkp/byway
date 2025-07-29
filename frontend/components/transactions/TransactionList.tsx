import React from "react";
import { Transaction } from "@/types/transaction";
import { ArrowUp, ArrowDown, AlertCircle } from "lucide-react";
import { formatDate, formatPrice } from "@/utils/formatPrice";
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
}) => {
  const getStatusInfo = (transaction: Transaction) => {
    const { status, type } = transaction;

    if (type === "WALLET_TOPUP") {
      switch (status) {
        case "COMPLETED":
          return {
            icon: <ArrowUp className="h-5 w-5 text-yellow-500" />,
            bgColor: "bg-green-100 dark:bg-green-900/30",
            textColor: "text-green-600 dark:text-green-400",
            label: "Wallet Top-up",
            amountPrefix: "+",
          };
        case "FAILED":
          return {
            icon: <AlertCircle className="h-5 w-5 text-yellow-500" />,
            bgColor: "bg-red-100 dark:bg-red-900/30",
            textColor: "text-red-600 dark:text-red-400",
            label: transaction.failureReason || "Top-up Failed",
            amountPrefix: "",
          };
        case "PENDING":
          return {
            icon: <AlertCircle className="h-5 w-5 text-yellow-500" />,
            bgColor: "bg-yellow-100 dark:bg-yellow-900/30",
            textColor: "text-yellow-600 dark:text-yellow-400",
            label: "Top-up Pending",
            amountPrefix: "",
          };
        default:
          return {
            icon: <AlertCircle className="h-5 w-5 text-yellow-500" />,
            bgColor: "bg-gray-100 dark:bg-gray-800",
            textColor: "text-gray-600 dark:text-gray-300",
            label: "Unknown Status",
            amountPrefix: "",
          };
      }
    }

    if (type === "PURCHASE") {
      switch (status) {
        case "COMPLETED":
          return {
            icon: <ArrowUp className="h-5 w-5 text-yellow-500" />,
            bgColor: "bg-red-100 dark:bg-red-900/30",
            textColor: "text-red-600 dark:text-red-400",
            label: "Purchase Completed",
            amountPrefix: "-",
          };
        case "FAILED":
          return {
            icon: <AlertCircle className="h-5 w-5 text-yellow-500" />,
            bgColor: "bg-red-100 dark:bg-red-900/30",
            textColor: "text-red-600 dark:text-red-400",
            label: transaction.failureReason || "Payment Failed",
            amountPrefix: "",
          };
        case "PENDING":
          return {
            icon: <AlertCircle className="h-5 w-5 text-yellow-500" />,
            bgColor: "bg-yellow-100 dark:bg-yellow-900/30",
            textColor: "text-yellow-600 dark:text-yellow-400",
            label: "Purchase Pending",
            amountPrefix: "",
          };
        default:
          return {
            icon: <AlertCircle className="h-5 w-5 text-yellow-500" />,
            bgColor: "bg-gray-100 dark:bg-gray-800",
            textColor: "text-gray-600 dark:text-gray-300",
            label: "Unknown Status",
            amountPrefix: "",
          };
      }
    }

    switch (status) {
      case "COMPLETED":
        return {
          icon: <ArrowDown className="h-5 w-5 text-yellow-500" />,
          bgColor: "bg-green-100 dark:bg-green-900/30",
          textColor: "text-green-600 dark:text-green-400",
          label: "Payment Received",
          amountPrefix: "+",
        };
      case "FAILED":
        return {
          icon: <AlertCircle className="h-5 w-5 text-yellow-500" />,
          bgColor: "bg-red-100 dark:bg-red-900/30",
          textColor: "text-red-600 dark:text-red-400",
          label: transaction.failureReason || "Payment Failed",
          amountPrefix: "",
        };
      case "PENDING":
        return {
          icon: <AlertCircle className="h-5 w-5 text-yellow-500" />,
          bgColor: "bg-yellow-100 dark:bg-yellow-900/30",
          textColor: "text-yellow-600 dark:text-yellow-400",
          label: "Payment Pending",
          amountPrefix: "",
        };
      default:
        return {
          icon: <AlertCircle className="h-5 w-5 text-yellow-500" />,
          bgColor: "bg-gray-100 dark:bg-gray-800",
          textColor: "text-gray-600 dark:text-gray-300",
          label: "Unknown Status",
          amountPrefix: "",
        };
    }
  };

  if (isLoading) {
    return (
      <div className="py-8 space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
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
        <p className="text-sm mt-2">
          Your transaction history will appear here
        </p>
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
            className="flex items-center p-4 bg-white dark:bg-[#232326] rounded-lg transition-colors"
          >
            <div
              className={`h-10 w-10 rounded-full flex items-center justify-center mr-4 ${statusInfo.bgColor}`}
            >
              {statusInfo.icon}
            </div>

            <div className="flex-1">
              <p className="text-sm font-medium text-yellow-500">
                {statusInfo.label}
                {transaction.courseId && (
                  <span className="text-xs text-gray-500 dark:text-gray-300 ml-2">
                    (Course: {transaction.courseId})
                  </span>
                )}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-300">
                {formatDate(transaction.createdAt)}
              </p>
            </div>

            <div className="text-right">
              <p className={`text-lg font-semibold ${statusInfo.textColor}`}>
                {statusInfo.amountPrefix}
                {formatPrice(transaction.amount)}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-300">
                {transaction.paymentGateway || "Unknown Gateway"}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
