import { ICart } from "@/types/cart";
import { Receipt, HelpCircle } from "lucide-react";
import Link from "next/link";

interface OrderSummaryProps {
	cart: ICart[];
}

export function OrderSummary({ cart }: OrderSummaryProps) {
	const formatPrice = (price: number | string | undefined): string => {
		if (typeof price === "string") {
			return `₹${parseFloat(price).toFixed(2)}`;
		}
		if (typeof price === "number") {
			return `₹${price.toFixed(2)}`;
		}
		return "₹0.00";
	};

	const subtotal = cart.reduce(
		(total, item) => total + (item.course?.offer || item.course?.price || 0),
		0,
	);

	const total = subtotal;

	return (
		<div className="bg-[var(--color-background)] rounded-lg p-6 border border-[var(--color-primary-light)]/20">
			<div className="flex items-center gap-3 mb-6">
				<Receipt className="h-5 w-5 text-[var(--color-primary-light)]" />
				<h2 className="text-lg font-semibold text-[var(--color-primary-dark)]">
					Order Summary
				</h2>
			</div>

			<div className="space-y-4">
				<div className="flex justify-between text-sm">
					<span className="text-[var(--color-muted)]">
						Subtotal ({cart.length} {cart.length === 1 ? "course" : "courses"})
					</span>
					<span className="font-medium text-[var(--color-primary-dark)]">
						{formatPrice(subtotal)}
					</span>
				</div>

				<div className="border-t border-[var(--color-primary-dark)] pt-4">
					<div className="flex justify-between items-center">
						<span className="font-semibold text-[var(--color-primary-dark)]">
							Total
						</span>
						<span className="font-bold text-xl text-[var(--color-primary-light)]">
							{formatPrice(total)}
						</span>
					</div>
				</div>

				<div className="pt-4 border-t border-[var(--color-background)]">
					<Link
						href="/contact"
						className="flex items-center justify-center gap-2 w-full py-2 text-sm text-[var(--color-primary-dark)] hover:text-[var(--color-primary-light)] transition-colors"
					>
						<HelpCircle className="h-4 w-4" />
						Need help? Contact support
					</Link>
				</div>
			</div>
		</div>
	);
}
