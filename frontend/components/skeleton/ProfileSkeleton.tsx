import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const ProfileSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      {/* Sidebar Skeleton */}
      <div className="w-full md:w-64 bg-white shadow-md rounded-lg md:rounded-r-none p-6">
        <div className="flex flex-col items-center pb-6 border-b border-gray-200">
          <Skeleton className="h-24 w-24 rounded-full" />
          <Skeleton className="h-6 w-36 mt-4" />
          <Skeleton className="h-4 w-48 mt-2" />
          <Skeleton className="h-6 w-16 mt-2" />
        </div>
        <div className="mt-6 space-y-3">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <Skeleton key={item} className="h-10 w-full" />
          ))}
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="flex-1 p-4 md:p-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <Skeleton className="h-8 w-40" />
            <Skeleton className="h-10 w-28" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                <div key={item} className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
              <div className="col-span-2 space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-32 w-full" />
              </div>
              <div className="col-span-2 space-y-2">
                <Skeleton className="h-4 w-20" />
                <div className="flex flex-wrap gap-2">
                  {[1, 2, 3, 4, 5].map((item) => (
                    <Skeleton key={item} className="h-8 w-20" />
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfileSkeleton;
