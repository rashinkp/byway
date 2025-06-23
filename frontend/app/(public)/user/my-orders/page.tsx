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
import { Pagination } from "@/components/ui/Pagination";

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
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(10);
  const { orders, isLoading, error, fetchOrders } = useOrders();

  useEffect(() => {
    fetchOrders({
      page: currentPage,
      limit: ordersPerPage,
      sortBy: "createdAt",
      sortOrder: "desc",
    });
  }, [fetchOrders, currentPage, ordersPerPage]);

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

      {!orders || !orders.orders?.length ? (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-4 text-gray-300">
            <CreditCard className="w-full h-full" />
          </div>
          <h3 className="text-lg font-medium text-gray-900">No orders found</h3>
          <p className="mt-2 text-sm text-gray-500">
            You haven't placed any orders yet.
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-6">
            {orders.orders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
          {orders.totalPages > 1 && (
            <div className="mt-8 flex justify-center">
              <Pagination
                currentPage={currentPage}
                totalPages={orders.totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default OrderListing;
