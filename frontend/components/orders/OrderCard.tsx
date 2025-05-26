import React from "react";
import { RefreshCw, Clock, Calendar, DollarSign, XCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { StatusBadge } from "./StatusBadge";
import { Order } from "@/types/order";
import { useStripe } from "@/hooks/stripe/useStripe";
import { toast } from "sonner";

interface OrderCardProps {
  order: Order;
  onRetryPayment: (orderId: string) => void;
  isRetrying: boolean;
}

export const OrderCard: React.FC<OrderCardProps> = ({
  order,
  onRetryPayment,
  isRetrying,
}) => {
  const { createStripeCheckoutSession } = useStripe();

  const handleRetryPayment = async () => {
    try {
      // Prepare course details for retry
      const coursesInput = order.items.map(item => ({
        id: item.courseId,
        title: item.title || 'Unknown Course',
        description: item.description || 'No description available',
        price: item.price || 0,
        offer: item.coursePrice,
        thumbnail: item.thumbnail || '',
        level: item.level || 'BEGINNER',
      }));

      // Create new checkout session with existing order ID
      await createStripeCheckoutSession({
        courses: coursesInput,
        userId: order.userId,
        orderId: order.id // Pass the existing order ID
      });
    } catch (error) {
      console.error("Failed to retry payment:", error);
      toast.error("Failed to retry payment. Please try again later.");
    }
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

  const getLevelColor = (level: string): string => {
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

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex gap-4">
        {/* Course Thumbnail */}
        <div className="w-24 h-24 flex-shrink-0">
          <img
            src={order.items[0]?.thumbnail || ''}
            alt={order.items[0]?.title || 'Course'}
            className="w-full h-full object-cover rounded-lg"
            onError={(e) => {
              e.currentTarget.src = `https://via.placeholder.com/96x96/f3f4f6/9ca3af?text=${order.items[0]?.title?.charAt(0) || 'C'}`;
            }}
          />
        </div>

        {/* Course Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-900 truncate pr-4">
              {order.items[0]?.title || 'Untitled Course'}
            </h3>
            <div className="flex gap-2 flex-shrink-0">
              <StatusBadge status={order.paymentStatus} type="payment" />
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {formatDate(order.createdAt)}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span>
                Order ID: <span className="font-mono">{order.id.slice(-8)}</span>
              </span>
              {order.paymentId && (
                <span>
                  Payment ID:{" "}
                  <span className="font-mono">{order.paymentId.slice(-8)}</span>
                </span>
              )}
            </div>

            {order.paymentStatus === "FAILED" && (
              <button
                onClick={handleRetryPayment}
                disabled={isRetrying}
                className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RefreshCw className={`w-4 h-4 ${isRetrying ? "animate-spin" : ""}`} />
                {isRetrying ? "Retrying..." : "Retry Payment"}
              </button>
            )}
          </div>
        </div>

        {/* Price */}
        <div className="text-right flex-shrink-0">
          <div className="text-xl font-bold text-gray-900 flex items-center gap-1">
            {formatPrice(order.amount)}
          </div>
        </div>
      </div>

      {order.orderStatus === "FAILED" && (
        <Alert className="mt-4 border-red-200 bg-red-50">
          <XCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            Payment failed. Please retry the payment or contact support if the issue persists.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}; 