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
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center gap-2 mb-6">
        <Receipt className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold">Order Summary</h2>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="font-medium">{formatPrice(subtotal)}</span>
        </div>

        <div className="border-t pt-4">
          <div className="flex justify-between">
            <span className="font-semibold">Total</span>
            <span className="font-semibold text-lg">{formatPrice(total)}</span>
          </div>
        </div>

        <div className="pt-4">
          <Badge variant="outline" className="w-full justify-center gap-2 py-2">
            <HelpCircle className="h-4 w-4" />
            <Link href="/contact" className="text-sm">
              Need help? Contact support
            </Link>
          </Badge>
        </div>
      </div>
    </div>
  );
}
