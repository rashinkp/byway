import { Suspense } from "react";
import CheckoutContent from "../../../../components/checkout/CheckoutContent";
import { LoadingSpinner } from "@/components/admin";

export default function CheckoutPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <CheckoutContent />
    </Suspense>
  );
}
