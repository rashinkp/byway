import React from "react";
import { Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";

interface StatusBadgeProps {
  status: string;
  type?: "order" | "payment";
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  type = "order",
}) => {
  interface StatusConfig {
    icon: React.ComponentType<{ className?: string }>;
    color: string;
    bg: string;
    text: string;
  }

  const getStatusConfig = (): StatusConfig => {
    if (type === "payment") {
      switch (status) {
        case "COMPLETED":
          return {
            icon: CheckCircle,
            color: "text-green-600",
            bg: "bg-green-50",
            text: "Paid",
          };
        case "PENDING":
          return {
            icon: Clock,
            color: "text-yellow-600",
            bg: "bg-yellow-50",
            text: "Pending",
          };
        case "FAILED":
          return {
            icon: XCircle,
            color: "text-red-600",
            bg: "bg-red-50",
            text: "Failed",
          };
        case "REFUNDED":
          return {
            icon: AlertCircle,
            color: "text-purple-600",
            bg: "bg-purple-50",
            text: "Refunded",
          };
        default:
          return {
            icon: AlertCircle,
            color: "text-gray-600",
            bg: "bg-gray-50",
            text: status,
          };
      }
    } else {
      switch (status) {
        case "COMPLETED":
          return {
            icon: CheckCircle,
            color: "text-green-600",
            bg: "bg-green-50",
            text: "Completed",
          };
        case "PENDING":
          return {
            icon: Clock,
            color: "text-yellow-600",
            bg: "bg-yellow-50",
            text: "Pending",
          };
        case "CONFIRMED":
          return {
            icon: CheckCircle,
            color: "text-blue-600",
            bg: "bg-blue-50",
            text: "Confirmed",
          };
        case "FAILED":
          return {
            icon: XCircle,
            color: "text-red-600",
            bg: "bg-red-50",
            text: "Failed",
          };
        case "CANCELLED":
          return {
            icon: XCircle,
            color: "text-gray-600",
            bg: "bg-gray-50",
            text: "Cancelled",
          };
        default:
          return {
            icon: AlertCircle,
            color: "text-gray-600",
            bg: "bg-gray-50",
            text: status,
          };
      }
    }
  };

  const { icon: Icon, color, bg, text } = getStatusConfig();

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${color} ${bg}`}
    >
      <Icon className="w-3 h-3" />
      {text}
    </span>
  );
}; 