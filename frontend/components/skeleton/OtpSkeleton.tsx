import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { SplitScreenLayout } from "@/components/ui/SplitScreenLayout";

const OtpSkeleton: React.FC = () => {
  return (
    <SplitScreenLayout
      title="Almost There!"
      description="Complete the verification process to access your new account and start your learning journey."
      imageAlt="Verification illustration"
    >
      <div className="min-h-screen flex items-center justify-center bg-gray-50/50 p-4">
        <div className="w-full max-w-md">
          {/* Header Section */}
          <div className="text-center mb-8">
            <Skeleton className="h-8 w-48 mx-auto mb-2" />
            <Skeleton className="h-4 w-64 mx-auto" />
          </div>

          {/* OTP Input Skeleton */}
          <div className="mb-8">
            <div className="flex justify-center gap-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Skeleton key={i} className="h-12 w-12 rounded-lg" />
              ))}
            </div>
          </div>

          {/* Timer and Resend Section */}
          <div className="flex flex-col items-center space-y-4">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 w-32" />
            </div>
            <Skeleton className="h-12 w-full rounded-lg" />
          </div>
        </div>
      </div>
    </SplitScreenLayout>
  );
};

export default OtpSkeleton; 