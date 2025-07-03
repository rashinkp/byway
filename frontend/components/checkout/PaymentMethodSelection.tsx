"use client";

import { useState } from "react";
import { CreditCard, Wallet, CheckCircle2, Clock, AlertCircle } from "lucide-react";
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
      <div className="flex items-center gap-2 text-[var(--color-primary-dark)] mb-4">
        <CreditCard className="w-5 h-5 text-[var(--color-primary-light)]" />
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
                ? "border-[var(--color-surface)] bg-[var(--color-muted)]/10 cursor-not-allowed opacity-75"
                : selectedMethod === method.id
                ? "border-[var(--color-primary-light)] bg-[var(--color-background)] cursor-pointer"
                : "border-[var(--color-primary-light)]/20  hover:bg-[var(--color-background)]/70 cursor-pointer"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`p-2 rounded-lg ${
                  method.disabled 
                    ? "bg-[var(--color-background)]"
                    : selectedMethod === method.id 
                    ? "bg-[var(--color-primary-light)]/10" 
                    : "bg-[var(--color-background)]"
                }`}>
                  <method.icon className={`w-5 h-5 ${
                    method.disabled 
                      ? "text-[var(--color-muted)]"
                      : selectedMethod === method.id 
                      ? "text-[var(--color-primary-light)]" 
                      : "text-[var(--color-muted)]"
                  }`} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className={`font-medium ${
                      method.disabled ? "text-[var(--color-muted)]" : "text-[var(--color-primary-dark)]"
                    }`}>
                      {method.name}
                    </h3>
                    {method.disabled && (
                      <Badge variant="outline" className="bg-[var(--color-warning)]/20 text-[var(--color-muted)] border-[var(--color-muted)]/40">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        {method.disabledReason}
                      </Badge>
                    )}
                  </div>
                  <p className={`text-sm ${
                    method.disabled ? "text-[var(--color-muted)]" : "text-[var(--color-muted)]"
                  }`}>
                    {method.description}
                    {method.disabled && method.id === "PAYPAL" && (
                      <span className="block mt-1 text-[var(--color-danger)]">
                        We're working on fixing some technical issues. Please use other payment methods for now.
                      </span>
                    )}
                  </p>
                </div>
              </div>
              {!method.disabled && selectedMethod === method.id && (
                <Badge variant="outline" className="bg-[var(--color-primary-light)]/10 text-[var(--color-primary-light)] border-[var(--color-primary-light)]/40">
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
