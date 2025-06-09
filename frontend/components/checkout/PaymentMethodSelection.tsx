"use client";

import { FC, memo, useEffect } from "react";
import PayPalPayment from "../PayPalPayment";
import { useAuth } from "@/hooks/auth/useAuth";
import { toast } from "sonner";
import { ICourseInput } from "@/types/stripe.types";
import { useWallet } from "@/hooks/wallet/useWallet";

interface PaymentMethod {
  id: "razorpay" | "paypal" | "stripe" | "wallet";
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
  courses: ICourseInput[];
}

const paymentMethods: PaymentMethod[] = [
  { id: "wallet", name: "Wallet" },
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
    courses,
  }) => {
    const { user } = useAuth();
    const { wallet } = useWallet();

    useEffect(() => {
      console.log("PaymentMethodSelection inputs:", {
        userId: user?.id,
        courses,
        couponCode,
        finalAmount,
      });
    }, [user?.id, courses, couponCode, finalAmount]);

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
              {method.id === "wallet" && wallet && (
                <span className="ml-auto text-sm text-gray-500">
                  Balance: ${wallet.balance.toFixed(2)}
                </span>
              )}
            </div>
          ))}
        </div>

        {selectedMethod === "wallet" && (
          <div className="space-y-4">
            <p className="text-gray-700">
              Pay using your wallet balance. {wallet && wallet.balance < finalAmount && (
                <span className="text-red-500">
                  Insufficient balance. Please top up your wallet. 
                </span>
              )}
            </p>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={onSubmit}
                disabled={isPending || isDisabled || !wallet || wallet.balance < finalAmount}
                className={`inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white ${
                  isPending || isDisabled || !wallet || wallet.balance < finalAmount
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700"
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500`}
              >
                {isPending ? "Processing..." : "Pay with Wallet"}
              </button>
            </div>
          </div>
        )}

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
          <div className="space-y-4">
            <p className="text-gray-700">
              You will be redirected to Stripe to complete your payment.
            </p>
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
                {isPending ? "Processing..." : "Pay with Stripe"}
              </button>
            </div>
          </div>
        )}

        {selectedMethod !== "paypal" && (
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
        )}
      </div>
    );
  }
);

export default PaymentMethodSelection;
