"use client";

import { Suspense } from "react";
import PaymentFailedContent from "@/components/payment/PaymentFailedContent";
import { LoadingSpinner } from "@/components/admin";

export default function PaymentFailedPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <PaymentFailedContent />
    </Suspense>
  );
} 