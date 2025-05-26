import React from "react";
import { RefreshCw, Clock, Calendar, DollarSign, XCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { StatusBadge } from "./StatusBadge";
import { Order } from "@/types/order";
import { useStripe } from "@/hooks/stripe/useStripe";
import { toast } from "sonner";
import { formatDate, formatPrice } from "@/utils/formatters";
import { Button } from "@/components/ui/button";

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
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-sm font-medium text-gray-900">
              Order #{order.id.slice(0, 8)}
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              {formatDate(order.createdAt)}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {/* <StatusBadge status={order.orderStatus} type="order" /> */}
            <StatusBadge status={order.paymentStatus} type="payment" />
          </div>
        </div>
      </div>

      <div className="divide-y divide-gray-200">
        {order.items.map((item) => (
          <div key={item.id} className="p-4 flex items-start justify-between">
            <div className="flex gap-4">
              <div className="w-16 h-16 flex-shrink-0">
                <img
                  src={item.thumbnail || "/placeholder-course.jpg"}
                  alt={item.title}
                  className="w-full h-full object-cover rounded-md"
                />
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-900">{item.title}</h4>
                <p className="text-xs text-gray-500 mt-1">
                  Level: {item.level}
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-sm text-gray-500 line-through">
                    {formatPrice(item.price || 0)}
                  </span>
                  <span className="text-sm font-medium text-green-600">
                    {formatPrice(item.coursePrice)}
                  </span>
                  {item.discount && item.discount > 0 && (
                    <span className="text-xs text-green-600">
                      (-{item.discount}%)
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">
                {formatPrice(item.coursePrice)}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {item.approvalStatus === "APPROVED" ? "Approved" : "Pending Approval"}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 bg-gray-50 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-500">Total Amount</p>
            <p className="text-lg font-semibold text-gray-900">
              {formatPrice(order.amount)}
            </p>
          </div>
          {order.paymentStatus === "FAILED" && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onRetryPayment(order.id)}
              disabled={isRetrying}
              className="text-blue-600 hover:text-blue-700"
            >
              {isRetrying ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Retrying...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Retry Payment
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}; 