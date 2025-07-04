import { Receipt, CreditCard, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

interface OrderSummaryProps {
	subtotal: number | string;
	total: number | string;
	isPending: boolean;
	onSubmit: () => void;
}

export default function OrderSummary({
	subtotal,
	total,
	isPending,
	onSubmit,
}: OrderSummaryProps) {
	const formatPrice = (price: number | string | undefined) => {
		if (!price) return "0.00";
		const numPrice = typeof price === "string" ? parseFloat(price) : price;
		return numPrice.toFixed(2);
	};

	return (
		<div className="space-y-6">
			<div className="flex items-center gap-2 text-[var(--color-primary-dark)] mb-4">
				<Receipt className="w-5 h-5 text-[var(--color-primary-light)]" />
				<h2 className="text-lg font-semibold">Order Summary</h2>
			</div>
			<Separator />
			<div className="space-y-4">
				<div className="flex justify-between items-center">
					<span className="text-[var(--color-muted)]">Subtotal</span>
					<span className="font-medium text-[var(--color-primary-dark)]">
						${formatPrice(subtotal)}
					</span>
				</div>
				<Separator />
				<div className="flex justify-between items-center">
					<span className="text-lg font-semibold text-[var(--color-primary-dark)]">
						Total
					</span>
					<span className="text-xl font-bold text-[var(--color-primary-light)]">
						${formatPrice(total)}
					</span>
				</div>
			</div>

			<div className="space-y-4">
				<div className="flex items-center gap-2 text-[var(--color-primary-dark)]">
					<CreditCard className="w-5 h-5 text-[var(--color-primary-light)]" />
					<h3 className="text-sm font-medium">Payment Method</h3>
				</div>
				<div className="p-4 bg-[var(--color-background)] rounded-xl border border-[var(--color-primary-light)]/20">
					<p className="text-sm text-[var(--color-muted)]">
						You will be redirected to the payment gateway to complete your
						purchase securely.
					</p>
				</div>
			</div>

			<Button
				onClick={onSubmit}
				disabled={isPending}
				className="w-full bg-[var(--color-primary-light)] hover:bg-[var(--color-primary-dark)] text-[var(--color-surface)] font-medium py-3 px-6 rounded-xl transition-colors flex items-center justify-center"
			>
				{isPending && <LoadingSpinner size="sm" className="mr-2" />}
				{isPending ? "Processing..." : "Complete Payment"}
				{!isPending && <ArrowRight className="w-4 h-4 ml-2" />}
			</Button>
		</div>
	);
}
