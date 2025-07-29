import { Suspense } from "react";
import CheckoutContent from "../../../../components/checkout/CheckoutContent";

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}
