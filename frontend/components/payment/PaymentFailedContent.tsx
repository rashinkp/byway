"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { AlertCircle, ArrowLeft, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import ErrorDisplay from "@/components/ErrorDisplay";
import { useReleaseCheckoutLock } from "@/hooks/stripe/useReleaseCheckoutLock";

export default function PaymentFailedContent() {
  const searchParams = useSearchParams();
  const [error, setError] = useState<string>("");
  const { mutate: releaseLock } = useReleaseCheckoutLock();

  useEffect(() => {
    const errorMessage = searchParams.get("error");
    if (errorMessage) {
      setError(decodeURIComponent(errorMessage));
    }
    // Always try to release any lingering checkout lock when landing here
    releaseLock();
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-white/80 dark:bg-[#18181b] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-white/80 dark:bg-[#232323] rounded-xl shadow-lg p-8 text-center border border-[#facc15]"
      >
        <div className="flex justify-center mb-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
          >
            <AlertCircle className="h-16 w-16 text-[#facc15]" />
          </motion.div>
        </div>

        <h1 className="text-2xl font-bold text-[#facc15] mb-4">Payment Failed</h1>
        {error && (
          <ErrorDisplay error={error} title="Payment Failed" description="There was a problem processing your payment." compact />
        )}

        <div className="space-y-4">
          <Link href="/user/profile?section=orders" className="block">
            <Button
              className="w-full bg-[#facc15] text-black py-2 px-4 rounded-lg hover:bg-black hover:text-[#facc15] dark:bg-[#facc15] dark:text-black dark:hover:bg-black dark:hover:text-[#facc15] transition-colors flex items-center justify-center gap-2 border border-[#facc15]"
            >
              <ShoppingBag className="h-4 w-4" />
              View Orders
            </Button>
          </Link>

          <Link href="/" className="block">
            <Button
              className="w-full bg-white/80 dark:bg-[#232323] text-black dark:text-white py-2 px-4 rounded-lg hover:bg-[#facc15]/10 dark:hover:bg-[#facc15]/10 transition-colors flex items-center justify-center gap-2 border border-[#facc15]"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>

        <div className="mt-8 text-center text-sm text-[#facc15]">
          <p>Need help? Contact our support team</p>
          <Link href="/contact" className="text-[#facc15] hover:underline">
            Contact Support
          </Link>
        </div>
      </motion.div>
    </div>
  );
} 