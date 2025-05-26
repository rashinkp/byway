"use client";

import React, { useState, useEffect } from "react";
import {
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  CreditCard,
} from "lucide-react";
import { OrderSkeleton } from "@/components/orders/OrderSkeleton";
import { OrderCard } from "@/components/orders/OrderCard";
import { useOrders } from "@/hooks/order/useOrders";

interface StatusBadgeProps {
  status: string;
  type?: "order" | "payment";
}

const StatusBadge: React.FC<StatusBadgeProps> = ({
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
        case "FAILED":
          return {
            icon: XCircle,
            color: "text-red-600",
            bg: "bg-red-50",
            text: "Failed",
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

const OrderListing: React.FC = () => {
  const { orders, isLoading, error, fetchOrders } = useOrders();
  const [retryingOrder, setRetryingOrder] = useState<string | null>(null);


  useEffect(() => {
    fetchOrders({
      page: 1,
      limit: 10,
      sortBy: "createdAt",
      sortOrder: "desc",
    });
  }, [fetchOrders]);

  const handleRetryPayment = async (orderId: string) => {
    setRetryingOrder(orderId);
    // TODO: Implement retry payment logic
    setTimeout(() => {
      setRetryingOrder(null);
    }, 2000);
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">My Orders</h1>
          <p className="text-gray-600">
            Track your course purchases and enrollments
          </p>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <OrderSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">My Orders</h1>
        <p className="text-gray-600">
          Track your course purchases and enrollments
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
          {error}
        </div>
      )}

      {!orders?.orders.length ? (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-4 text-gray-300">
            <CreditCard className="w-full h-full" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No orders yet
          </h3>
          <p className="text-gray-600">
            Start learning by purchasing your first course!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.orders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onRetryPayment={handleRetryPayment}
              isRetrying={retryingOrder === order.id}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderListing;
