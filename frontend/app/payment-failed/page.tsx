"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AlertCircle, ArrowLeft, ShoppingBag } from "lucide-react";
import Link from "next/link";

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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-6 space-y-6">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <AlertCircle className="h-16 w-16 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Payment Failed</h1>
          {error && (
            <p className="text-sm text-gray-600 bg-red-50 p-3 rounded-md">
              {error}
            </p>
          )}
        </div>

        <div className="space-y-4">
          <Link href="/user/my-orders" className="block">
            <Button
              className="w-full flex items-center justify-center gap-2"
              variant="default"
            >
              <ShoppingBag className="h-4 w-4" />
              View Orders
            </Button>
          </Link>

          <Link href="/" className="block">
            <Button
              className="w-full flex items-center justify-center gap-2"
              variant="ghost"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>

        <div className="text-center text-sm text-gray-500">
          <p>Need help? Contact our support team</p>
          <Link href="/contact" className="text-blue-600 hover:underline">
            Contact Support
          </Link>
        </div>
      </Card>
    </div>
  );
} 