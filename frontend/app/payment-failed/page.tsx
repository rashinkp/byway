"use client";

import { Suspense } from "react";
import PaymentFailedContent from "@/components/payment/PaymentFailedContent";

export default function PaymentFailedPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PaymentFailedContent />
    </Suspense>
  );
} 