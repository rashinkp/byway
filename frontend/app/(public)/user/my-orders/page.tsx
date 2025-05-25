"use client";

import React, { useState } from "react";
import {
  RefreshCw,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  CreditCard,
  Calendar,
  DollarSign,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Define interfaces for type safety
interface Course {
  id: string;
  title: string;
  description: string;
  level: "BEGINNER" | "MEDIUM" | "ADVANCED";
  price: number;
  thumbnail: string;
  duration: number;
  offer: number;
  status: "PUBLISHED" | "DRAFT" | "ARCHIVED";
}

interface Order {
  id: string;
  userId: string;
  amount: number;
  paymentStatus: "COMPLETED" | "PENDING" | "FAILED";
  paymentGateway: "STRIPE" | "PAYPAL";
  paymentId: string | null;
  orderStatus: "COMPLETED" | "PENDING" | "FAILED";
  createdAt: string;
  updatedAt: string;
  course: Course;
}

// Dummy data with explicit types
const dummyOrders: Order[] = [
  {
    id: "order-1",
    userId: "user-1",
    amount: 299.99,
    paymentStatus: "COMPLETED",
    paymentGateway: "STRIPE",
    paymentId: "pi_1234567890",
    orderStatus: "COMPLETED",
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-15T10:32:00Z",
    course: {
      id: "course-1",
      title: "Complete React Development Bootcamp",
      description:
        "Master React from basics to advanced concepts including hooks, context, and state management. Build real-world projects and become job-ready.",
      level: "MEDIUM",
      price: 299.99,
      thumbnail:
        "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=300&fit=crop",
      duration: 40,
      offer: 0,
      status: "PUBLISHED",
    },
  },
  {
    id: "order-2",
    userId: "user-1",
    amount: 199.99,
    paymentStatus: "FAILED",
    paymentGateway: "PAYPAL",
    paymentId: null,
    orderStatus: "FAILED",
    createdAt: "2024-01-14T15:45:00Z",
    updatedAt: "2024-01-14T15:47:00Z",
    course: {
      id: "course-2",
      title: "JavaScript Fundamentals & ES6+",
      description:
        "Learn modern JavaScript from scratch including ES6+ features, async programming, and DOM manipulation.",
      level: "BEGINNER",
      price: 199.99,
      thumbnail:
        "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400&h=300&fit=crop",
      duration: 25,
      offer: 50,
      status: "PUBLISHED",
    },
  },
  {
    id: "order-3",
    userId: "user-1",
    amount: 399.99,
    paymentStatus: "PENDING",
    paymentGateway: "STRIPE",
    paymentId: "pi_pending_123",
    orderStatus: "PENDING",
    createdAt: "2024-01-16T09:15:00Z",
    updatedAt: "2024-01-16T09:15:00Z",
    course: {
      id: "course-3",
      title: "Full Stack Web Development with Node.js",
      description:
        "Build complete web applications using Node.js, Express, MongoDB, and React. Includes deployment strategies.",
      level: "ADVANCED",
      price: 399.99,
      thumbnail:
        "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=300&fit=crop",
      duration: 60,
      offer: 0,
      status: "PUBLISHED",
    },
  },
];

const OrderSkeleton: React.FC = () => (
  <div className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse">
    <div className="flex gap-4">
      <div className="w-24 h-24 bg-gray-200 rounded-lg flex-shrink-0"></div>
      <div className="flex-1">
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
        <div className="flex gap-4">
          <div className="h-4 bg-gray-200 rounded w-20"></div>
          <div className="h-4 bg-gray-200 rounded w-16"></div>
          <div className="h-4 bg-gray-200 rounded w-24"></div>
        </div>
      </div>
      <div className="text-right">
        <div className="h-6 bg-gray-200 rounded w-20 mb-2"></div>
        <div className="h-6 bg-gray-200 rounded w-16"></div>
      </div>
    </div>
  </div>
);

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
  const [orders, setOrders] = useState<Order[]>(dummyOrders);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [retryingOrder, setRetryingOrder] = useState<string | null>(null);

  const handleRetryPayment = async (orderId: string) => {
    setRetryingOrder(orderId);
    // Simulate API call
    setTimeout(() => {
      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId
            ? { ...order, paymentStatus: "PENDING", orderStatus: "PENDING" }
            : order
        )
      );
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

  const getLevelColor = (level: Course["level"]): string => {
    switch (level) {
      case "BEGINNER":
        return "text-green-600 bg-green-50";
      case "MEDIUM":
        return "text-blue-600 bg-blue-50";
      case "ADVANCED":
        return "text-purple-600 bg-purple-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
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

      {orders.length === 0 ? (
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
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex gap-4">
                {/* Course Thumbnail */}
                <div className="w-24 h-24 flex-shrink-0">
                  <img
                    src={order.course.thumbnail}
                    alt={order.course.title}
                    className="w-full h-full object-cover rounded-lg"
                    onError={(e) => {
                      e.currentTarget.src = `https://via.placeholder.com/96x96/f3f4f6/9ca3af?text=${order.course.title.charAt(
                        0
                      )}`;
                    }}
                  />
                </div>

                {/* Course Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 truncate pr-4">
                      {order.course.title}
                    </h3>
                    <div className="flex gap-2 flex-shrink-0">
                      <StatusBadge
                        status={order.paymentStatus}
                        type="payment"
                      />
                      <StatusBadge status={order.orderStatus} type="order" />
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {order.course.description}
                  </p>

                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(
                        order.course.level
                      )}`}
                    >
                      {order.course.level}
                    </span>
                    {order.course.duration && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {order.course.duration}h
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {formatDate(order.createdAt)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>
                        Order ID:{" "}
                        <span className="font-mono">{order.id.slice(-8)}</span>
                      </span>
                      {order.paymentId && (
                        <span>
                          Payment ID:{" "}
                          <span className="font-mono">
                            {order.paymentId.slice(-8)}
                          </span>
                        </span>
                      )}
                    </div>

                    {order.orderStatus === "FAILED" && (
                      <button
                        onClick={() => handleRetryPayment(order.id)}
                        disabled={retryingOrder === order.id}
                        className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <RefreshCw
                          className={`w-4 h-4 ${
                            retryingOrder === order.id ? "animate-spin" : ""
                          }`}
                        />
                        {retryingOrder === order.id
                          ? "Retrying..."
                          : "Retry Payment"}
                      </button>
                    )}
                  </div>
                </div>

                {/* Price */}
                <div className="text-right flex-shrink-0">
                  <div className="text-xl font-bold text-gray-900 flex items-center gap-1">
                    <DollarSign className="w-5 h-5" />
                    {formatPrice(order.amount)}
                  </div>
                  {order.course.offer > 0 && (
                    <div className="text-sm text-gray-500 line-through">
                      {formatPrice(order.course.price)}
                    </div>
                  )}
                </div>
              </div>

              {order.orderStatus === "FAILED" && (
                <Alert className="mt-4 border-red-200 bg-red-50">
                  <XCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800">
                    Payment failed. Please retry the payment or contact support
                    if the issue persists.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderListing;
