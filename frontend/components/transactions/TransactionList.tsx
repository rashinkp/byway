import React from "react";
import { Transaction } from "@/types/transaction";
import { ArrowUp, ArrowDown, AlertCircle, RefreshCw } from "lucide-react";
import { formatDate, formatPrice } from "@/utils/formatters";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

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
            icon: <ArrowUp className="h-5 w-5 text-green-600" />,
            bgColor: "bg-green-100",
            textColor: "text-green-600",
            label: "Wallet Top-up",
            amountPrefix: "+",
          };
        case "FAILED":
          return {
            icon: <AlertCircle className="h-5 w-5 text-red-600" />,
            bgColor: "bg-red-100",
            textColor: "text-red-600",
            label: transaction.failureReason || "Top-up Failed",
            amountPrefix: "",
          };
        case "PENDING":
          return {
            icon: <AlertCircle className="h-5 w-5 text-yellow-600" />,
            bgColor: "bg-yellow-100",
            textColor: "text-yellow-600",
            label: "Top-up Pending",
            amountPrefix: "",
          };
        default:
          return {
            icon: <AlertCircle className="h-5 w-5 text-gray-600" />,
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
            icon: <ArrowUp className="h-5 w-5 text-red-600" />,
            bgColor: "bg-red-100",
            textColor: "text-red-600",
            label: "Purchase Completed",
            amountPrefix: "-",
          };
        case "FAILED":
          return {
            icon: <AlertCircle className="h-5 w-5 text-red-600" />,
            bgColor: "bg-red-100",
            textColor: "text-red-600",
            label: transaction.failureReason || "Payment Failed",
            amountPrefix: "",
          };
        case "PENDING":
          return {
            icon: <AlertCircle className="h-5 w-5 text-yellow-600" />,
            bgColor: "bg-yellow-100",
            textColor: "text-yellow-600",
            label: "Purchase Pending",
            amountPrefix: "",
          };
        default:
          return {
            icon: <AlertCircle className="h-5 w-5 text-gray-600" />,
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
          icon: <ArrowDown className="h-5 w-5 text-green-600" />,
          bgColor: "bg-green-100",
          textColor: "text-green-600",
          label: "Payment Received",
          amountPrefix: "+",
        };
      case "FAILED":
        return {
          icon: <AlertCircle className="h-5 w-5 text-red-600" />,
          bgColor: "bg-red-100",
          textColor: "text-red-600",
          label: transaction.failureReason || "Payment Failed",
          amountPrefix: "",
        };
      case "PENDING":
        return {
          icon: <AlertCircle className="h-5 w-5 text-yellow-600" />,
          bgColor: "bg-yellow-100",
          textColor: "text-yellow-600",
          label: "Payment Pending",
          amountPrefix: "",
        };
      default:
        return {
          icon: <AlertCircle className="h-5 w-5 text-gray-600" />,
          bgColor: "bg-gray-100",
          textColor: "text-gray-600",
          label: "Unknown Status",
          amountPrefix: "",
        };
    }
  };

  if (isLoading) {
    return (
      <div className="py-8">
        <LoadingSpinner text="Loading transactions..." />
      </div>
    );
  }

  if (!transactions?.length) {
    return (
      <div className="text-center py-8 text-gray-500">
        <AlertCircle className="w-12 h-12 mx-auto mb-4 text-gray-400" />
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
            className="flex items-center p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className={`h-10 w-10 rounded-full flex items-center justify-center mr-4 ${statusInfo.bgColor}`}>
              {statusInfo.icon}
            </div>

            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">
                {statusInfo.label}
                {transaction.courseId && (
                  <span className="text-xs text-gray-500 ml-2">
                    (Course: {transaction.courseId})
                  </span>
                )}
              </p>
              <p className="text-sm text-gray-500">
                {formatDate(transaction.createdAt)}
              </p>
            </div>

            <div className="text-right">
              <p className={`text-lg font-semibold ${statusInfo.textColor}`}>
                {statusInfo.amountPrefix}{formatPrice(transaction.amount)}
              </p>
              <p className="text-sm text-gray-500">
                {transaction.paymentGateway || "Unknown Gateway"}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
