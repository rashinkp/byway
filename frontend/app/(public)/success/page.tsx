import { Suspense } from "react";
import SuccessContent from "@/components/payment/PaymentSuccessMain";

export default function SuccessPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
