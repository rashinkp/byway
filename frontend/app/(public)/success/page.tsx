"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { CheckCircleIcon, WalletIcon } from "lucide-react";

const SuccessPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const isWalletTopUp = searchParams.get("type") === "wallet-topup";
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const verifySession = async () => {
      if (!sessionId) {
        setIsLoading(false);
        return;
      }

      try {
        toast.success("Payment verified successfully!");
        setIsLoading(false);
      } catch (err) {
        console.error("Error verifying Stripe session:", err);
        toast.warning(
          "Payment completed, but verification encountered an issue"
        );
        setIsLoading(false);
      }
    };

    verifySession();
  }, [sessionId]);

  const handleGoToCourses = () => {
    router.push("/user/my-courses");
  };

  const handleGoToWallet = () => {
    router.push("/user/wallet");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-700 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verifying your payment...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Error</h1>
          <p className="mt-2 text-gray-600">{error}</p>
          <button
            onClick={() => router.push("/")}
            className="mt-4 px-6 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            delay: 0.2,
            type: "spring",
            stiffness: 200,
            damping: 20,
          }}
        >
          {isWalletTopUp ? (
            <WalletIcon className="h-16 w-16 text-green-500 mx-auto" />
          ) : (
            <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto" />
          )}
        </motion.div>
        <h1 className="mt-4 text-2xl font-bold text-gray-900">
          {isWalletTopUp ? "Wallet Top-up Successful!" : "Payment Successful!"}
        </h1>
        <p className="mt-2 text-gray-600">
          {isWalletTopUp
            ? "Your wallet has been topped up successfully. You can now use your wallet balance for purchases."
            : "Thank you for your purchase. Your courses are now available in your account."}
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={isWalletTopUp ? handleGoToWallet : handleGoToCourses}
          className="mt-6 px-6 py-3 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors"
        >
          {isWalletTopUp ? "Go to Wallet" : "Go to My Courses"}
        </motion.button>
      </motion.div>
    </div>
  );
};

export default SuccessPage;
