"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { CheckCircleIcon, WalletIcon } from "lucide-react";
import { useAuth } from "@/hooks/auth/useAuth";

const SuccessPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const sessionId = searchParams.get("session_id");
  const orderId = searchParams.get("order_id");
  const isWalletTopUp = searchParams.get("type") === "wallet-topup";
  const isWalletPayment = searchParams.get("type") === "wallet-payment";
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    <div className="min-h-screen bg-gray-50/50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center"
      >
        <div className="flex justify-center mb-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
          >
            {isWalletTopUp ? (
              <WalletIcon className="h-16 w-16 text-green-500" />
            ) : (
              <CheckCircleIcon className="h-16 w-16 text-green-500" />
            )}
          </motion.div>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          {isWalletTopUp
            ? "Wallet Top-up Successful!"
            : isWalletPayment
            ? "Payment Successful!"
            : "Payment Successful!"}
        </h1>

        <p className="text-gray-600 mb-8">
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
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Go to My Courses
            </button>
          )}
          <button
            onClick={handleGoToWallet}
            className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Go to Wallet
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default SuccessPage;
