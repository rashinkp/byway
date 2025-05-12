import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { Course } from "@/types/cart";

interface OrderSummaryProps {
  courses: Course[];
  totalDiscountedPrice: number;
  tax: number;
  finalAmount: number;
}

export function OrderSummary({
  courses,
  totalDiscountedPrice,
  tax,
  finalAmount,
}: OrderSummaryProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
      <h2 className="text-xl font-semibold pb-4 border-b mb-4">
        Order Summary
      </h2>
      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-gray-600">Subtotal</span>
          <span>${totalDiscountedPrice.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Tax (7%)</span>
          <span>${tax.toFixed(2)}</span>
        </div>
      </div>
      <div className="flex justify-between font-bold text-lg pt-4 border-t mt-4">
        <span>Total</span>
        <span>${finalAmount.toFixed(2)}</span>
      </div>
      <div className="mt-6 text-center text-sm text-gray-500">
        <p>
          Need help?{" "}
          <a href="#" className="text-blue-600 hover:underline">
            Contact Support
          </a>
        </p>
      </div>
    </div>
  );
}
