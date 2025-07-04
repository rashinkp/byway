import { FC, memo } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { usePayPalPayment } from "@/hooks/usePaypalPayment";
import { Skeleton } from "@/components/ui/skeleton";

interface PayPalPaymentProps {
	paypalOptions: {
		clientId: string;
		currency: string;
		intent?: string;
	};
	finalAmount: number;
	isPending: boolean;
}

const PayPalPayment: FC<PayPalPaymentProps> = memo(
	({ paypalOptions, finalAmount, isPending }) => {
		const { isPaypalLoading, createOrder, onApprove, onCancel, onError } =
			usePayPalPayment({ paypalOptions, finalAmount });

		return (
			<div className="mt-6">
				{isPaypalLoading ? (
					<Skeleton className="h-12 w-full rounded-lg" />
				) : (
					<PayPalScriptProvider options={paypalOptions}>
						<PayPalButtons
							style={{ layout: "vertical" }}
							onInit={(data) => {
								console.log("PayPal SDK initialized:", data);
							}}
							createOrder={createOrder}
							onApprove={onApprove}
							onCancel={onCancel}
							onError={onError}
							disabled={isPending}
						/>
					</PayPalScriptProvider>
				)}
			</div>
		);
	},
);

PayPalPayment.displayName = "PayPalPayment";

export default PayPalPayment;
