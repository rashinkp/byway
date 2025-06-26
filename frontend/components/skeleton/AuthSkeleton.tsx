import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { SplitScreenLayout } from "@/components/ui/SplitScreenLayout";

const AuthSkeleton: React.FC = () => {
  return (
    <SplitScreenLayout
      title="Learning Reimagined"
      description="Join thousands of students and instructors on our platform to unlock your potential."
      imageAlt="Learning platform illustration"
    >
      <div className="min-h-screen flex items-center justify-center bg-gray-50/50 p-4">
        <div className="w-full max-w-md">
          {/* Header Section */}
          <div className="text-center mb-8">
            <Skeleton className="h-8 w-48 mx-auto mb-2" />
            <Skeleton className="h-4 w-64 mx-auto" />
          </div>

          {/* Social Auth Buttons */}
          <div className="space-y-4 mb-6">
            <Skeleton className="h-12 w-full rounded-lg" />
            <Skeleton className="h-12 w-full rounded-lg" />
          </div>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <Skeleton className="w-full h-px" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <Skeleton className="h-4 w-24 bg-card px-2" />
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
          </div>

          {/* Submit Button */}
          <Skeleton className="h-12 w-full rounded-md mt-6" />

          {/* Links */}
          <div className="text-center mt-6">
            <Skeleton className="h-4 w-48 mx-auto" />
          </div>
        </div>
      </div>
    </SplitScreenLayout>
  );
};

export default AuthSkeleton; 