import { ShoppingCart } from "lucide-react";
import Link from "next/link";

// Empty Cart Component
export function EmptyCart() {
  return (
    <div className="bg-white p-12 rounded-lg shadow-sm text-center">
      <div className="flex justify-center mb-4">
        <ShoppingCart size={64} className="text-gray-300" />
      </div>
      <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
      <p className="text-gray-500 mb-6">
        Browse our courses and find something to learn today!
      </p>
      <Link
        href="/courses"
        className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-md"
      >
        Explore Courses
      </Link>
    </div>
  );
}
