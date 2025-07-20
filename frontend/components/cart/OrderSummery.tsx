import { ICart } from "@/types/cart";
import { HelpCircle } from "lucide-react";
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
		<div className="bg-white dark:bg-[#232323] rounded-lg p-6 ">
			<div className="flex items-center gap-3 mb-6">
				<h2 className="text-lg font-semibold text-black dark:text-[#facc15]">
					Order Summary
				</h2>
			</div>

			<div className="space-y-4">
				<div className="flex justify-between text-sm">
					<span className="text-gray-500 dark:text-gray-300">
						Subtotal ({cart.length} {cart.length === 1 ? "course" : "courses"})
					</span>
					<span className="font-medium text-gray-500 dark:text-gray-300 ">
						{formatPrice(subtotal)}
					</span>
				</div>

				<div className="pt-4">
					<div className="flex justify-between items-center">
						<span className="font-semibold text-black dark:text-[#facc15]">
							Total
						</span>
						<span className="font-bold text-xl dark:text-[#facc15]">
							{formatPrice(total)}
						</span>
					</div>
				</div>

				<div className="pt-4 border-t dark:border-[#facc15]">
					<Link
						href="/contact"
						className="flex items-center justify-center gap-2 w-full py-2 text-sm transition-colors"
					>
						<HelpCircle className="h-4 w-4" />
						Need help? Contact support
					</Link>
				</div>
			</div>
		</div>
	);
}
