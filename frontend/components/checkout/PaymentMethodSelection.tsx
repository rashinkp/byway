"use client";

import { FC, memo, useEffect } from "react";
import PayPalPayment from "../PayPalPayment"; 

interface PaymentMethod {
  id: "razorpay" | "paypal" | "stripe";
  name: string;
}

interface PaymentMethodSelectionProps {
  selectedMethod: PaymentMethod["id"];
  onMethodSelect: (methodId: PaymentMethod["id"]) => void;
  couponCode: string;
  onCouponChange: (code: string) => void;
  onSubmit: (e: React.MouseEvent) => void;
  isPending: boolean;
  isDisabled: boolean;
  paypalOptions: {
    clientId: string;
    currency: string;
    intent?: string;
  };
  finalAmount: number;
}

const paymentMethods: PaymentMethod[] = [
  { id: "paypal", name: "PayPal" },
  { id: "razorpay", name: "Razorpay" },
  { id: "stripe", name: "Stripe" },
];

const PaymentMethodSelection: FC<PaymentMethodSelectionProps> = memo(
  ({
    selectedMethod,
    onMethodSelect,
    couponCode,
    onCouponChange,
    onSubmit,
    isPending,
    isDisabled,
    paypalOptions,
    finalAmount,
  }) => {
    console.log("Rendering PaymentMethodSelection, props:", {
      selectedMethod,
      couponCode,
      isPending,
      isDisabled,
      paypalOptions,
      finalAmount,
    });

    useEffect(() => {
      console.log("PaymentMethodSelection props changed:", {
        selectedMethod,
        couponCode,
        isPending,
        isDisabled,
        finalAmount,
      });
    }, [selectedMethod, couponCode, isPending, isDisabled, finalAmount]);

    return (
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-800">
          Select Payment Method
        </h2>

        <div className="bg-gray-50 p-4 rounded-md mb-6">
          {paymentMethods.map((method) => (
            <div
              key={method.id}
              className="flex items-center p-4 border rounded-md mb-2 cursor-pointer hover:bg-gray-100"
              onClick={() => !isPending && onMethodSelect(method.id)}
            >
              <input
                type="radio"
                name="paymentMethod"
                checked={selectedMethod === method.id}
                onChange={() => onMethodSelect(method.id)}
                disabled={isPending}
                className="h-5 w-5 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-3 text-gray-700">{method.name}</span>
            </div>
          ))}
        </div>

        {selectedMethod === "paypal" && (
          <PayPalPayment
            paypalOptions={paypalOptions}
            finalAmount={finalAmount}
            isPending={isPending}
          />
        )}

        {selectedMethod === "razorpay" && (
          <div className="text-center text-gray-500">
            Razorpay integration coming soon
          </div>
        )}

        {selectedMethod === "stripe" && (
          <div className="text-center text-gray-500">
            Stripe integration coming soon
          </div>
        )}

        {selectedMethod !== "paypal" && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Coupon Code (Optional)
              </label>
              <input
                type="text"
                value={couponCode}
                onChange={(e) => onCouponChange(e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Enter coupon code"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={onSubmit}
                disabled={isPending || isDisabled}
                className={`inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white ${
                  isPending || isDisabled
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
              >
                {isPending ? "Processing..." : "Confirm Payment"}
              </button>
            </div>
          </>
        )}
      </div>
    );
  }
);

export default PaymentMethodSelection;
