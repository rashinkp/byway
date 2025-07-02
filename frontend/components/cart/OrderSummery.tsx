import { ICart } from "@/types/cart";
import { Receipt, HelpCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

interface OrderSummaryProps {
  cart: ICart[];
}

export function OrderSummary({ cart }: OrderSummaryProps) {
  const formatPrice = (price: number | string | undefined): string => {
    if (typeof price === 'string') {
      return `₹${parseFloat(price).toFixed(2)}`;
    }
    if (typeof price === 'number') {
      return `₹${price.toFixed(2)}`;
    }
    return '₹0.00';
  };

  const subtotal = cart.reduce(
    (total, item) => total + (item.course?.offer || item.course?.price || 0),
    0
  );

  const total = subtotal;

  return (
    <div className="bg-[var(--color-surface)] rounded-xl shadow-sm border border-[var(--color-border)] p-6">
      <div className="flex items-center gap-2 mb-6">
        <Receipt className="h-5 w-5 text-[var(--color-primary-light)]" />
        <h2 className="text-lg font-semibold text-[var(--color-primary-dark)]">Order Summary</h2>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between text-sm">
          <span className="text-[var(--color-muted)]">Subtotal</span>
          <span className="font-medium text-[var(--color-primary-dark)]">{formatPrice(subtotal)}</span>
        </div>

        <div className="border-t border-[var(--color-border)] pt-4 mt-4">
          <div className="flex justify-between">
            <span className="font-semibold text-[var(--color-primary-dark)]">Total</span>
            <span className="font-semibold text-lg text-[var(--color-primary-light)]">{formatPrice(total)}</span>
          </div>
        </div>

        <div className="pt-4">
          <Badge variant="outline" className="w-full justify-center gap-2 py-2 bg-[var(--color-background)] text-[var(--color-primary-dark)] border-[var(--color-border)]">
            <HelpCircle className="h-4 w-4 text-[var(--color-primary-light)]" />
            <Link href="/contact" className="text-sm text-[var(--color-primary-dark)]">
              Need help? Contact support
            </Link>
          </Badge>
        </div>
      </div>
    </div>
  );
}
