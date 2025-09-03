import React from "react";
import { RefreshCw, Calendar, DollarSign, BookOpen } from "lucide-react";
import { StatusBadge } from "./StatusBadge";
import { Order } from "@/types/order";
import {  formatPrice } from "@/utils/formatPrice";
import { Button } from "@/components/ui/button";
import { useRetryOrder } from "@/hooks/order/useRetryOrder";
import Image from "next/image";
import { formatDate } from "@/lib/utils";
import { useSignedUrl } from "@/hooks/file/useSignedUrl";

interface OrderCardProps {
  order: Order;
}

// Helper component for individual order items
function OrderItemCard({ item }: { item: Order['items'][0] }) {
  const { url: thumbnailUrl } = useSignedUrl(item.thumbnail || null);

  // Calculate proper discount percentage
  const originalPrice = item.price ? Number(item.price) : 0;
  const finalPrice = item.coursePrice ? Number(item.coursePrice) : 0;
  const hasDiscount = originalPrice > 0 && finalPrice > 0 && finalPrice < originalPrice;
  const discountPercentage = hasDiscount
    ? Math.round(((originalPrice - finalPrice) / originalPrice) * 100)
    : 0;

  return (
    <div className="flex items-center gap-3 p-3 border-b border-gray-100 dark:border-gray-700 last:border-b-0">
      {/* Course Image */}
      <div className="flex-shrink-0">
        <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600">
          <Image
            src={thumbnailUrl || "/placeholder-course.jpg"}
            alt={item.title}
            className="w-full h-full object-cover"
            width={64}
            height={64}
          />
          {hasDiscount && discountPercentage > 0 && (
            <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-bl-md rounded-tr-md">
              -{discountPercentage}%
            </div>
          )}
        </div>
      </div>

      {/* Course Details */}
      <div className="flex-1 min-w-0">
        <h4 className="text-base font-semibold text-gray-900 dark:text-white mb-1 line-clamp-1">
          {item.title}
        </h4>
        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-[#facc15] rounded-full"></span>
            {item.level}
          </span>
          <span className="flex items-center gap-1">
            <span className={`w-1.5 h-1.5 rounded-full ${
              item.approvalStatus === "APPROVED" ? "bg-green-500" : "bg-yellow-500"
            }`}></span>
            {item.approvalStatus === "APPROVED" ? "Approved" : "Pending"}
          </span>
        </div>
      </div>

      {/* Price Section */}
      <div className="flex-shrink-0 text-right">
        {hasDiscount && (
          <div className="text-xs text-gray-500 dark:text-gray-400 line-through mb-0.5">
            {formatPrice(originalPrice)}
          </div>
        )}
        <div className="text-lg font-bold text-[#facc15]">
          {formatPrice(finalPrice)}
        </div>
        {hasDiscount && discountPercentage > 0 && (
          <div className="text-xs text-red-500 dark:text-red-400 font-medium">
            Save {formatPrice(originalPrice - finalPrice)}
          </div>
        )}
      </div>
    </div>
  );
}

export function OrderCard({ order }: OrderCardProps) {
  const { mutate: retryOrder, isPending: isRetrying } = useRetryOrder();

  const handleRetry = () => {
    retryOrder(order.id);
  };

  return (
    <div className="bg-white dark:bg-[#232323] rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-[#facc15]/10 to-[#facc15]/5 dark:from-[#facc15]/20 dark:to-[#facc15]/10 p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#facc15] rounded-lg flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-black" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                Order #{order.id.slice(0, 8).toUpperCase()}
              </h3>
              <div className="flex items-center gap-1 mt-0.5">
                <Calendar className="w-3 h-3 text-gray-500 dark:text-gray-400" />
                <p className="text-xs text-gray-600 dark:text-gray-300">
                  {formatDate(order.createdAt)}
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge status={order.paymentStatus} type="payment" />
            {order.paymentStatus === "FAILED" && (
              <Button
                variant="secondary"
                size="sm"
                onClick={handleRetry}
                disabled={isRetrying}
                className="border-[#facc15] text-[#facc15] hover:bg-[#facc15] hover:text-black dark:border-[#facc15] dark:text-[#facc15] dark:hover:bg-[#facc15] dark:hover:text-black text-xs px-2 py-1 h-7"
              >
                {isRetrying ? (
                  <>
                    <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
                    Retrying...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-3 h-3 mr-1" />
                    Retry
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Course Items Section */}
      <div className="p-0">
        {order.items.map((item) => (
          <OrderItemCard key={item.orderId} item={item} />
        ))}
      </div>

      {/* Footer Section */}
      <div className="bg-gray-50 dark:bg-gray-800/50 p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-[#facc15]" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Total ({order.items.length} course{order.items.length !== 1 ? "s" : ""})
            </span>
          </div>
          <div className="text-right">
            <p className="text-xl font-bold text-[#facc15]">
              {formatPrice(order.amount)}
            </p>
            <div className="flex items-center justify-end gap-1 text-xs text-gray-500 dark:text-gray-400">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
              <span>{order.paymentStatus.toLowerCase()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
