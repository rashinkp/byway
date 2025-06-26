import React from "react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const InstructorDetailSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50/50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section Skeleton */}
        <Card className="bg-white/80 backdrop-blur-sm border border-gray-100 shadow-sm rounded-xl p-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="flex items-center gap-6">
              <Skeleton className="w-20 h-20 rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-32" />
                <div className="flex items-center gap-3">
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-6 w-28" />
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Main Content Skeleton */}
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:w-3/4">
            <Card className="bg-white/80 backdrop-blur-sm border border-gray-100 shadow-sm rounded-xl overflow-hidden">
              {/* Tabs Section Skeleton */}
              <div className="border-b border-gray-100">
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
              <div className="p-6">
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
            <Card className="bg-white/80 backdrop-blur-sm border border-gray-100 shadow-sm rounded-xl p-6 sticky top-6">
              <div className="space-y-6">
                <div className="space-y-3">
                  <Skeleton className="h-5 w-24" />
                  <div className="space-y-3">
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