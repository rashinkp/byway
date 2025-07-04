import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

// Empty Cart Component
export function EmptyCart() {
	return (
		<div className="bg-[var(--color-surface)] rounded-lg p-12 text-center">
			<div className="flex justify-center mb-6">
				<div className="w-20 h-20 rounded-full bg-[var(--color-primary-light)]/10 flex items-center justify-center">
					<ShoppingCart
						size={40}
						className="text-[var(--color-primary-light)]"
					/>
				</div>
			</div>
			<h2 className="text-2xl font-semibold text-[var(--color-primary-dark)] mb-3">
				Your cart is empty
			</h2>
			<p className="text-[var(--color-muted)] mb-8 max-w-md mx-auto">
				Browse our courses and find something to learn today!
			</p>
			<Button
				asChild
				className="bg-[var(--color-primary-dark)] hover:bg-[var(--color-primary-light)] text-[var(--color-surface)] font-medium py-3 px-8 rounded-lg transition-colors"
			>
				<Link href="/courses">Explore Courses</Link>
			</Button>
		</div>
	);
}
