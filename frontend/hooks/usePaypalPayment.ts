import { useState, useCallback } from "react";
import { toast } from "sonner";

interface PayPalOptions {
	clientId: string;
	currency: string;
	intent?: string;
}

interface PayPalActions {
	order: {
		create: (orderData: { purchase_units: Array<{ amount: { value: string; currency_code: string } }> }) => Promise<string>;
		capture: () => Promise<{ id: string; status: string; [key: string]: unknown }>;
	};
}

interface UsePayPalPaymentProps {
	paypalOptions: PayPalOptions;
	finalAmount: number;
}

interface UsePayPalPaymentReturn {
	isPaypalLoading: boolean;
	setIsPaypalLoading: (loading: boolean) => void;
	createOrder: (data: Record<string, unknown>, actions: PayPalActions) => Promise<string>;
	onApprove: (data: Record<string, unknown>, actions: PayPalActions) => Promise<void>;
	onCancel: (data: Record<string, unknown>) => void;
	onError: (err: Record<string, unknown>) => void;
}

export const usePayPalPayment = ({
	paypalOptions,
	finalAmount,
}: UsePayPalPaymentProps): UsePayPalPaymentReturn => {
	const [isPaypalLoading, setIsPaypalLoading] = useState(false);

	const createOrder = useCallback(
		async (data: Record<string, unknown>, actions: PayPalActions) => {
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
		[finalAmount, paypalOptions.currency],
	);

	const onApprove = useCallback(async (data: Record<string, unknown>, actions: PayPalActions) => {
		try {
			const details = await actions.order?.capture();
			toast.success("Payment completed successfully!", {
				description: JSON.stringify(details),
			});
		} catch  {
			toast.error("Failed to complete PayPal payment");
		}
	}, []);

	const onCancel = useCallback(() => {
		toast.info("PayPal payment was cancelled");
	}, []);

	const onError = useCallback(() => {
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
