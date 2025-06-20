import { Receipt, Tag, CreditCard, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface OrderSummaryProps {
  subtotal: number | string;
  discount: number | string;
  total: number | string;
  onApplyCoupon: () => void;
  couponCode: string;
  onCouponChange: (value: string) => void;
  isPending: boolean;
  onSubmit: () => void;
}

export default function OrderSummary({
  subtotal,
  discount,
  total,
  onApplyCoupon,
  couponCode,
  onCouponChange,
  isPending,
  onSubmit,
}: OrderSummaryProps) {
  const formatPrice = (price: number | string | undefined) => {
    if (!price) return "0.00";
    const numPrice = typeof price === "string" ? parseFloat(price) : price;
    return numPrice.toFixed(2);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-gray-900 mb-4">
        <Receipt className="w-5 h-5 text-blue-600" />
        <h2 className="text-lg font-semibold">Order Summary</h2>
      </div>
      <Separator />
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-medium text-gray-900">${formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Discount</span>
          <span className="font-medium text-green-600">-${formatPrice(discount)}</span>
        </div>
        <Separator />
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold text-gray-900">Total</span>
          <span className="text-xl font-bold text-blue-700">${formatPrice(total)}</span>
        </div>
      </div>


      <div className="space-y-4">
        <div className="flex items-center gap-2 text-gray-900">
          <CreditCard className="w-5 h-5 text-blue-600" />
          <h3 className="text-sm font-medium">Payment Method</h3>
        </div>
        <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
          <p className="text-sm text-gray-600">
            You will be redirected to the payment gateway to complete your purchase securely.
          </p>
        </div>
      </div>

      <Button
        onClick={onSubmit}
        disabled={isPending}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-xl transition-colors"
      >
        {isPending ? "Processing..." : "Complete Payment"}
        <ArrowRight className="w-4 h-4 ml-2" />
      </Button>
    </div>
  );
}
