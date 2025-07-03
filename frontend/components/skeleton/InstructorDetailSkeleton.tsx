import React from "react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const InstructorDetailSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen bg-[var(--color-background)] p-0 md:p-8 flex flex-col items-center">
      <div className="w-full max-w-5xl mx-auto space-y-8">
        {/* Header Section Skeleton */}
        <Card className="bg-[var(--color-surface)]/95 shadow-xl border border-[var(--color-primary-light)]/20 rounded-2xl p-8 mt-8">
          <div className="flex items-center gap-8">
            <Skeleton className="w-24 h-24 rounded-full" />
            <div className="flex-1 space-y-3">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-32" />
              <div className="flex items-center gap-3">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-28" />
              </div>
            </div>
          </div>
        </Card>

        {/* Main Content Skeleton */}
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-3/4">
            <Card className="bg-[var(--color-surface)]/95 border border-[var(--color-primary-light)]/20 shadow-lg rounded-2xl overflow-hidden">
              {/* Tabs Section Skeleton */}
              <div className="border-b border-[var(--color-primary-light)]/20 bg-[var(--color-background)]/80">
                <div className="flex space-x-8 px-6 py-4">
                  {[1, 2, 3, 4].map((item) => (
                    <div key={item} className="flex items-center space-x-2 py-2 px-1">
                      <Skeleton className="w-4 h-4" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Content Section Skeleton */}
              <div className="p-8 bg-[var(--color-surface)]/90">
                <div className="space-y-6">
                  <Skeleton className="h-6 w-32" />
                  <div className="space-y-4">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                    <Skeleton className="h-4 w-4/6" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                  <div className="space-y-4">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-4 w-4/5" />
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar Skeleton */}
          <div className="lg:w-1/4">
            <Card className="bg-[var(--color-surface)]/95 border border-[var(--color-primary-light)]/20 shadow-lg rounded-2xl p-6 sticky top-8">
              <div className="space-y-8">
                <div className="space-y-4">
                  <Skeleton className="h-5 w-24" />
                  <div className="space-y-4">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorDetailSkeleton; 