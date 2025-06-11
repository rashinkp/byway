import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Empty Cart Component
export function EmptyCart() {
  return (
    <Card className="bg-white/80 backdrop-blur-sm border border-gray-100 shadow-sm rounded-xl p-12 text-center">
      <div className="flex justify-center mb-6">
        <div className="w-20 h-20 rounded-xl bg-blue-50 flex items-center justify-center">
          <ShoppingCart size={40} className="text-blue-600" />
        </div>
      </div>
      <h2 className="text-2xl font-semibold text-gray-900 mb-3">Your cart is empty</h2>
      <p className="text-gray-600 mb-8">
        Browse our courses and find something to learn today!
      </p>
      <Button
        asChild
        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-xl transition-colors"
      >
        <Link href="/courses">
          Explore Courses
        </Link>
      </Button>
    </Card>
  );
}
