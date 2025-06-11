"use client";

import { useState } from "react";
import { CreditCard, Wallet, Banknote, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

type PaymentMethodType = "WALLET" | "PAYPAL" | "STRIPE" | "RAZORPAY";

interface PaymentMethod {
  id: PaymentMethodType;
  name: string;
  icon: React.ElementType;
  description: string;
}

interface PaymentMethodSelectionProps {
  onMethodSelect: (method: PaymentMethodType) => void;
}

export default function PaymentMethodSelection({
  onMethodSelect,
}: PaymentMethodSelectionProps) {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethodType>("WALLET");

  const handleMethodSelect = (method: PaymentMethodType) => {
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
      id: "PAYPAL",
      name: "PayPal",
      icon: CreditCard,
      description: "Pay securely with PayPal",
    },
    {
      id: "RAZORPAY",
      name: "Razorpay",
      icon: Banknote,
      description: "Razorpay integration coming soon",
    },
    {
      id: "STRIPE",
      name: "Stripe",
      icon: CreditCard,
      description: "Pay securely with Stripe",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-gray-900 mb-4">
        <CreditCard className="w-5 h-5 text-blue-600" />
        <h2 className="text-lg font-semibold">Payment Method</h2>
      </div>
      <Separator />
      <div className="space-y-4">
        {paymentMethods.map((method) => (
          <div
            key={method.id}
            onClick={() => handleMethodSelect(method.id)}
            className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
              selectedMethod === method.id
                ? "border-blue-600 bg-blue-50"
                : "border-gray-200 hover:border-blue-200 hover:bg-blue-50/50"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`p-2 rounded-lg ${
                  selectedMethod === method.id ? "bg-blue-100" : "bg-gray-100"
                }`}>
                  <method.icon className={`w-5 h-5 ${
                    selectedMethod === method.id ? "text-blue-600" : "text-gray-600"
                  }`} />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{method.name}</h3>
                  <p className="text-sm text-gray-600">{method.description}</p>
                </div>
              </div>
              {selectedMethod === method.id && (
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
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
