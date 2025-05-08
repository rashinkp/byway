import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useCallback } from "react";
import { Course } from "@/types/cart";

interface OrderSummaryProps {
  courses: Course[];
}

export function OrderSummary({ courses }: OrderSummaryProps) {
  const calculateSubtotal = useCallback((): number => {
    return (
      courses?.reduce(
        (total, course) =>
          total +
          (typeof course?.offer === "string"
            ? parseFloat(course.offer)
            : typeof course?.offer === "number"
            ? course.offer
            : 0),
        0
      ) ?? 0
    );
  }, [courses]);

  const calculateTax = useCallback((): number => {
    return calculateSubtotal() * 0.07;
  }, [calculateSubtotal]);

  const calculateTotal = useCallback((): number => {
    return calculateSubtotal() + calculateTax();
  }, [calculateSubtotal, calculateTax]);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
      <h2 className="text-xl font-semibold pb-4 border-b mb-4">
        Order Summary
      </h2>
      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-gray-600">Subtotal</span>
          <span>${calculateSubtotal().toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Tax (7%)</span>
          <span>${calculateTax().toFixed(2)}</span>
        </div>
      </div>
      <div className="flex justify-between font-bold text-lg pt-4 border-t mt-4">
        <span>Total</span>
        <span>${calculateTotal().toFixed(2)}</span>
      </div>
      <Link
        href="/user/checkout"
        className={`w-full bg-blue-600 text-white font-medium py-3 px-4 rounded-md mt-6 flex items-center justify-center ${
          courses?.length === 0
            ? "opacity-50 cursor-not-allowed"
            : "hover:bg-blue-700"
        }`}
      >
        Proceed to Checkout
        <ChevronRight size={18} className="ml-1" />
      </Link>
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
