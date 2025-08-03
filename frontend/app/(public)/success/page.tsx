import { Suspense } from "react";
import SuccessContent from "@/components/payment/PaymentSuccessMain";
import { LoadingSpinner } from "@/components/admin";

export default function SuccessPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <SuccessContent />
    </Suspense>
  );
}
