import { Course, ICart } from "@/types/cart";
import { ChevronRight, HelpCircle } from "lucide-react";
import Link from "next/link";
import { useCallback } from "react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface OrderSummaryProps {
  cart: ICart[];
}

export const OrderSummary = ({ cart }: OrderSummaryProps) => {
  const calculateSubtotal = useCallback((): number => {
    return (
      cart?.reduce(
        (total, item) =>
          total +
          (typeof item?.course?.offer === "string"
            ? parseFloat(item.course?.offer)
            : typeof item?.course?.offer === "number"
            ? item.course?.offer
            : 0),
        0
      ) ?? 0
    );
  }, [cart]);

  const calculateTax = useCallback((): number => {
    return calculateSubtotal() * 0.07;
  }, [calculateSubtotal]);

  const calculateTotal = useCallback((): number => {
    return calculateSubtotal() + calculateTax();
  }, [calculateSubtotal, calculateTax]);

  return (
    <div className="bg-white/80 backdrop-blur-sm border border-gray-100 shadow-sm rounded-xl p-6 sticky top-24">
      <div className="flex items-center gap-2 text-gray-900 mb-4">
        <h2 className="text-xl font-semibold">Order Summary</h2>
      </div>
      <Separator className="mb-4" />
      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-gray-600">Subtotal</span>
          <span className="text-gray-800">${calculateSubtotal().toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Tax (7%)</span>
          <span className="text-gray-800">${calculateTax().toFixed(2)}</span>
        </div>
      </div>
      <Separator className="my-4" />
      <div className="flex justify-between font-bold text-lg">
        <span className="text-gray-900">Total</span>
        <span className="text-blue-700">${calculateTotal().toFixed(2)}</span>
      </div>
      <Link
        href="/user/checkout"
        className={`w-full bg-blue-600 text-white font-medium py-3 px-4 rounded-xl mt-6 flex items-center justify-center transition-colors ${
          cart?.length === 0
            ? "opacity-50 cursor-not-allowed"
            : "hover:bg-blue-700"
        }`}
      >
        Proceed to Checkout
        <ChevronRight size={18} className="ml-1" />
      </Link>
      <div className="mt-6 text-center">
        <Badge 
          variant="outline"
          className="bg-blue-50 text-blue-700 border-blue-200 inline-flex items-center gap-1"
        >
          <HelpCircle size={14} />
          Need help?{" "}
          <a href="#" className="hover:underline">
            Contact Support
          </a>
        </Badge>
      </div>
    </div>
  );
};
