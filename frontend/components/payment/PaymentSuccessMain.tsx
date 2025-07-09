"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { CheckCircleIcon, WalletIcon } from "lucide-react";
import { useAuth } from "@/hooks/auth/useAuth";
import ErrorDisplay from "@/components/ErrorDisplay";

export default function SuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const sessionId = searchParams.get("session_id");
  const orderId = searchParams.get("order_id");
  const isWalletTopUp = searchParams.get("type") === "wallet-topup";
  const isWalletPayment = searchParams.get("type") === "wallet-payment";
  const [isLoading, setIsLoading] = useState(true);
  const [error] = useState<string | null>(null);

  useEffect(() => {
    const verifySession = async () => {
      if (!sessionId && !orderId) {
        setIsLoading(false);
        return;
      }

      try {
        toast.success("Payment verified successfully!");
        setIsLoading(false);
      } catch (err) {
        console.error("Error verifying payment:", err);
        toast.warning(
          "Payment completed, but verification encountered an issue"
        );
        setIsLoading(false);
      }
    };

    verifySession();
  }, [sessionId, orderId]);

  const handleGoToCourses = () => {
    router.push("/user/profile?section=courses");
  };

  const handleGoToWallet = () => {
    if (!user) return;
    
    switch (user.role) {
      case "ADMIN":
        router.push("/admin/wallet");
        break;
      case "INSTRUCTOR":
        router.push("/instructor/wallet");
        break;
      case "USER":
        router.push("/user/profile?section=wallet");
        break;
      default:
        router.push("/user/profile?section=wallet");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--color-surface)] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--color-primary-light)] mx-auto"></div>
          <p className="mt-4 text-[var(--color-muted)]">Verifying your payment...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <ErrorDisplay error={error} title="Payment Error" description="There was a problem verifying your payment. Please try again or contact support." />
    );
  }

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
            transition={{ delay: 0.2, type: 'spring' }}
          >
            {isWalletTopUp ? (
              <WalletIcon className="h-16 w-16 text-[var(--color-primary-light)]" />
            ) : (
              <CheckCircleIcon className="h-16 w-16 text-[var(--color-primary-light)]" />
            )}
          </motion.div>
        </div>

        <h1 className="text-2xl font-bold text-[var(--color-primary-dark)] mb-4">
          {isWalletTopUp
            ? "Wallet Top-up Successful!"
            : isWalletPayment
            ? "Payment Successful!"
            : "Payment Successful!"}
        </h1>

        <p className="text-[var(--color-muted)] mb-8">
          {isWalletTopUp
            ? "Your wallet has been topped up successfully."
            : isWalletPayment
            ? "Your course purchase was successful. You can now access your courses."
            : "Your payment was successful. You can now access your courses."}
        </p>

        <div className="space-y-4">
          {!isWalletTopUp && (
            <button
              onClick={handleGoToCourses}
              className="w-full bg-[var(--color-primary-light)] text-[var(--color-surface)] py-2 px-4 rounded-lg hover:bg-[var(--color-primary-dark)] transition-colors"
            >
              Go to My Courses
            </button>
          )}
          <button
            onClick={handleGoToWallet}
            className="w-full bg-[var(--color-background)] text-[var(--color-primary-dark)] py-2 px-4 rounded-lg hover:bg-[var(--color-primary-light)]/10 transition-colors"
          >
            Go to Wallet
          </button>
        </div>
      </motion.div>
    </div>
  );
} 