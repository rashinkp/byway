import { useState, useCallback } from "react";
import { toast } from "sonner";

interface PayPalOptions {
  clientId: string;
  currency: string;
  intent?: string;
}

interface UsePayPalPaymentProps {
  paypalOptions: PayPalOptions;
  finalAmount: number;
}

interface UsePayPalPaymentReturn {
  isPaypalLoading: boolean;
  setIsPaypalLoading: (loading: boolean) => void;
  createOrder: (data: any, actions: any) => Promise<string>;
  onApprove: (data: any, actions: any) => Promise<void>;
  onCancel: (data: any) => void;
  onError: (err: any) => void;
}

export const usePayPalPayment = ({
  paypalOptions,
  finalAmount,
}: UsePayPalPaymentProps): UsePayPalPaymentReturn => {
  const [isPaypalLoading, setIsPaypalLoading] = useState(false);

  const createOrder = useCallback(
    async (data: any, actions: any) => {
      if (finalAmount <= 0) {
        toast.error("Invalid order amount");
        throw new Error("Invalid order amount");
      }

      return actions.order.create({
        purchase_units: [
          {
            amount: {
              value: finalAmount.toFixed(2),
              currency_code: paypalOptions.currency,
            },
          },
        ],
      });
    },
    [finalAmount, paypalOptions.currency]
  );

  const onApprove = useCallback(async (data: any, actions: any) => {
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
  }, []);

  const onCancel = useCallback((data: any) => {
    console.log("PayPal payment cancelled:", data);
    toast.info("PayPal payment was cancelled");
  }, []);

  const onError = useCallback((err: any) => {
    console.error("PayPal button error:", err);
    toast.error("An error occurred with PayPal. Please try again.");
  }, []);

  return {
    isPaypalLoading,
    setIsPaypalLoading,
    createOrder,
    onApprove,
    onCancel,
    onError,
  };
};
