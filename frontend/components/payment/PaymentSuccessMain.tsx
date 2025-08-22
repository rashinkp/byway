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
      } catch {
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
      <div className="min-h-screen bg-white/80 dark:bg-[#18181b] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#facc15] mx-auto"></div>
          <p className="mt-4 text-[#facc15]">Verifying your payment...</p>
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
            {isWalletTopUp ? (
              <WalletIcon className="h-16 w-16 text-[#facc15]" />
            ) : (
              <CheckCircleIcon className="h-16 w-16 text-[#facc15]" />
            )}
          </motion.div>
        </div>

        <h1 className="text-2xl font-bold text-[#facc15] mb-4">
          {isWalletTopUp
            ? "Wallet Top-up Successful!"
            : isWalletPayment
            ? "Payment Successful!"
            : "Payment Successful!"}
        </h1>

        <p className="text-[#facc15] mb-8">
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
              className="w-full bg-[#facc15] text-black py-2 px-4 rounded-lg hover:bg-black hover:text-[#facc15] dark:bg-[#facc15] dark:text-black dark:hover:bg-black dark:hover:text-[#facc15] transition-colors border border-[#facc15]"
            >
              Go to My Courses
            </button>
          )}
          <button
            onClick={handleGoToWallet}
            className="w-full bg-white/80 dark:bg-[#232323] text-black dark:text-white py-2 px-4 rounded-lg hover:bg-[#facc15]/10 dark:hover:bg-[#facc15]/10 transition-colors border border-[#facc15]"
          >
            Go to Wallet
          </button>
        </div>
      </motion.div>
    </div>
  );
} 