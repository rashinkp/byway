import { FC, memo, useState, useEffect } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { toast } from "sonner";

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
  finalAmount: number; // New prop for the final amount (totalDiscountedPrice + tax)
}

const paymentMethods: PaymentMethod[] = [{ id: "paypal", name: "PayPal" }];

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
    const [isPaypalLoading, setIsPaypalLoading] = useState(false);

    useEffect(() => {
      console.log("PaymentMethodSelection props changed:", {
        selectedMethod,
        couponCode,
        isPending,
        isDisabled,
        finalAmount,
      });
    }, [selectedMethod, couponCode, isPending, isDisabled, finalAmount]);

    const createOrder = (data: any, actions: any) => {
      if (finalAmount <= 0) {
        toast.error("Invalid order amount");
        throw new Error("Invalid order amount");
      }

      return actions.order.create({
        purchase_units: [
          {
            amount: {
              value: finalAmount.toFixed(2), // Use the final amount
              currency_code: paypalOptions.currency,
            },
          },
        ],
      });
    };

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
              onClick={() =>
                !isPending && !isPaypalLoading && onMethodSelect(method.id)
              }
            >
              <input
                type="radio"
                name="paymentMethod"
                checked={selectedMethod === method.id}
                onChange={() => onMethodSelect(method.id)}
                disabled={isPending || isPaypalLoading}
                className="h-5 w-5 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-3 text-gray-700">{method.name}</span>
            </div>
          ))}
        </div>

        {selectedMethod === "paypal" && (
          <div className="mt-6">
            {isPaypalLoading ? (
              <div className="text-center">Loading PayPal Buttons...</div>
            ) : (
              <PayPalScriptProvider options={paypalOptions}>
                <PayPalButtons
                  style={{ layout: "vertical" }}
                  onInit={(data, actions) => {
                    console.log("PayPal SDK initialized:", data);
                  }}
                  createOrder={createOrder}
                  onApprove={async (data, actions) => {
                    try {
                      console.log("PayPal order approved:", data);
                      const details = await actions.order?.capture();
                      toast.success("Payment completed successfully!", {
                        description: JSON.stringify(details),
                      });
                    } catch (error) {
                      console.error("Error in onApprove:", error);
                      toast.error("Failed to complete PayPal payment");
                    }
                  }}
                  onCancel={(data) => {
                    console.log("PayPal payment cancelled:", data);
                    toast.info("PayPal payment was cancelled");
                  }}
                  onError={(err) => {
                    console.error("PayPal button error:", err);
                    toast.error(
                      "An error occurred with PayPal. Please try again."
                    );
                  }}
                />
              </PayPalScriptProvider>
            )}
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
