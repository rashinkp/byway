"use client";

import { useState } from "react";
import { CreditCard, Wallet, CheckCircle2,  AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

type PaymentMethodType = "WALLET" | "STRIPE" | "PAYPAL";

interface PaymentMethod {
  id: PaymentMethodType;
  name: string;
  icon: React.ElementType;
  description: string;
  disabled?: boolean;
  disabledReason?: string;
}

interface PaymentMethodSelectionProps {
  onMethodSelect: (method: PaymentMethodType) => void;
}

export default function PaymentMethodSelection({
  onMethodSelect,
}: PaymentMethodSelectionProps) {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethodType>("WALLET");

  const handleMethodSelect = (method: PaymentMethodType) => {
    const selectedPaymentMethod = paymentMethods.find(m => m.id === method);
    if (selectedPaymentMethod?.disabled) return;
    setSelectedMethod(method);
    onMethodSelect(method);
  };

  const paymentMethods: PaymentMethod[] = [
    {
      id: "WALLET",
      name: "Wallet",
      icon: Wallet,
      description: "Pay using your wallet balance",
    },
    {
      id: "STRIPE",
      name: "Stripe",
      icon: CreditCard,
      description: "Pay securely with Stripe",
    },
    {
      id: "PAYPAL",
      name: "PayPal",
      icon: CreditCard,
      description: "Pay securely with PayPal",
      disabled: true,
      disabledReason: "Temporarily Unavailable",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-black dark:text-[#facc15] mb-4">
        <CreditCard className="w-5 h-5 text-[#facc15]" />
        <h2 className="text-lg font-semibold">Payment Method</h2>
      </div>
      <Separator />
      <div className="space-y-4">
        {paymentMethods.map((method) => (
          <div
            key={method.id}
            onClick={() => handleMethodSelect(method.id)}
            className={`p-4 rounded-xl border-2 transition-all ${
              method.disabled 
                ? "border-[#facc15]/20 bg-gray-100 dark:bg-[#232323] cursor-not-allowed opacity-75"
                : selectedMethod === method.id
                ? " bg-[#facc15] dark:bg-[#facc15] text-black border-none cursor-pointer"
                : "border-[#facc15]/20 bg-white dark:bg-[#232323] hover:bg-[#facc15]/10 dark:hover:bg-[#232323]/80 cursor-pointer"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`p-2 rounded-lg ${
                  method.disabled 
                    ? "bg-gray-100 dark:bg-[#232323]"
                    : selectedMethod === method.id 
                    ? "" 
                    : "bg-white dark:bg-[#232323]"
                }`}>
                  <method.icon className={`w-5 h-5 ${
                    method.disabled 
                      ? "text-gray-400 dark:text-gray-500"
                      : selectedMethod === method.id 
                      ? "" 
                      : "text-gray-400 dark:text-gray-500"
                  }`} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className={`font-medium ${
                      method.disabled ? "text-gray-400 dark:text-gray-500" : `text-black ${selectedMethod === method.id ? 'dark:text-black' : 'dark:text-white'}`
                    }`}>
                      {method.name}
                    </h3>
                    {method.disabled && (
                      <Badge variant="outline" className="bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 border-yellow-300 dark:border-yellow-700">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        {method.disabledReason}
                      </Badge>
                    )}
                  </div>
                  <p className={`text-sm ${
                     method.disabled
                       ? "text-gray-400 dark:text-gray-500"
                       : selectedMethod === method.id
                         ? 'text-black dark:text-black'
                         : 'text-gray-500 dark:text-gray-300'
                  }`}>
                    {method.description}
                    {method.disabled && method.id === "PAYPAL" && (
                      <span className="block mt-1 text-red-600 dark:text-red-400">
                        We're working on fixing some technical issues. Please use other payment methods for now.
                      </span>
                    )}
                  </p>
                </div>
              </div>
              {!method.disabled && selectedMethod === method.id && (
                <Badge variant="outline" className="bg-[#facc15] border-[#facc15]">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  Selected
                </Badge>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
