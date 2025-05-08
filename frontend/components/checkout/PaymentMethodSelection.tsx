import { CreditCard, DollarSign, Lock, ChevronRight } from "lucide-react";
import { JSX } from "react";

interface PaymentMethod {
  id: "razorpay" | "paypal" | "stripe";
  name: string;
  icon: JSX.Element;
}

const paymentMethods: PaymentMethod[] = [
  {
    id: "razorpay",
    name: "Razorpay",
    icon: <CreditCard size={20} className="text-blue-700" />,
  },
  {
    id: "paypal",
    name: "PayPal",
    icon: <DollarSign size={20} className="text-blue-700" />,
  },
  {
    id: "stripe",
    name: "Stripe",
    icon: <CreditCard size={20} className="text-blue-700" />,
  },
];

interface PaymentMethodSelectionProps {
  selectedMethod: PaymentMethod["id"];
  onMethodSelect: (methodId: PaymentMethod["id"]) => void;
  couponCode: string;
  onCouponChange: (code: string) => void;
  onSubmit: (e: React.MouseEvent) => void;
  isPending: boolean;
  isDisabled: boolean;
}

export default function PaymentMethodSelection({
  selectedMethod,
  onMethodSelect,
  couponCode,
  onCouponChange,
  onSubmit,
  isPending,
  isDisabled,
}: PaymentMethodSelectionProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Select Payment Method
      </h2>
      <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6 flex items-center">
        <Lock className="text-blue-700 mr-3" size={20} />
        <span className="text-sm text-blue-800">
          Your payment information is secure and encrypted
        </span>
      </div>

      <div className="space-y-4">
        {paymentMethods.map((method) => (
          <label
            key={method.id}
            className={`flex items-center p-4 border rounded-md cursor-pointer transition duration-200 ${
              selectedMethod === method.id
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300"
            }`}
          >
            <input
              type="radio"
              name="paymentMethod"
              value={method.id}
              checked={selectedMethod === method.id}
              onChange={() => onMethodSelect(method.id)}
              className="mr-3 text-blue-700 focus:ring-blue-500"
            />
            <div className="flex items-center">
              {method.icon}
              <span className="ml-2 text-gray-800">{method.name}</span>
            </div>
          </label>
        ))}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Coupon Code
        </label>
        <input
          type="text"
          value={couponCode}
          onChange={(e) => onCouponChange(e.target.value)}
          placeholder="Enter coupon code"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div className="mt-8 flex justify-end">
        <button
          type="button"
          onClick={onSubmit}
          disabled={isPending || isDisabled}
          className="bg-blue-700 hover:bg-blue-800 text-white py-3 px-8 rounded-md font-medium transition duration-300 disabled:bg-gray-400"
        >
          {isPending ? "Processing..." : "Complete Purchase"}
          <ChevronRight className="ml-2 inline" size={16} />
        </button>
      </div>
    </div>
  );
}
