"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { AlertCircle, ArrowLeft, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import ErrorDisplay from "@/components/ErrorDisplay";

export default function PaymentFailedPage() {
  const searchParams = useSearchParams();
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const errorMessage = searchParams.get("error");
    if (errorMessage) {
      setError(decodeURIComponent(errorMessage));
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-[var(--color-surface)] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-[var(--color-surface)] rounded-xl shadow-lg p-8 text-center border border-[var(--color-primary-light)]/20"
      >
        <div className="flex justify-center mb-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
          >
            <AlertCircle className="h-16 w-16 text-[var(--color-danger)]" />
          </motion.div>
        </div>

        <h1 className="text-2xl font-bold text-[var(--color-danger)] mb-4">Payment Failed</h1>
        {error && (
          <ErrorDisplay error={error} title="Payment Failed" description="There was a problem processing your payment." compact />
        )}

        <div className="space-y-4">
          <Link href="/user/my-orders" className="block">
            <Button
              className="w-full bg-[var(--color-primary-light)] text-[var(--color-surface)] py-2 px-4 rounded-lg hover:bg-[var(--color-primary-dark)] transition-colors flex items-center justify-center gap-2"
            >
              <ShoppingBag className="h-4 w-4" />
              View Orders
            </Button>
          </Link>

          <Link href="/" className="block">
            <Button
              className="w-full bg-[var(--color-background)] text-[var(--color-primary-dark)] py-2 px-4 rounded-lg hover:bg-[var(--color-primary-light)]/10 transition-colors flex items-center justify-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>

        <div className="mt-8 text-center text-sm text-[var(--color-muted)]">
          <p>Need help? Contact our support team</p>
          <Link href="/contact" className="text-[var(--color-primary-light)] hover:underline">
            Contact Support
          </Link>
        </div>
      </motion.div>
    </div>
  );
} 