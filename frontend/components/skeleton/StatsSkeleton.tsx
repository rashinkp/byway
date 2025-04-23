import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

interface StatsSkeletonProps {
  count?: number; // Number of stats cards
}

export function StatsSkeleton({ count = 3 }: StatsSkeletonProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {[...Array(count)].map((_, i) => (
        <Card key={i} className="border-none shadow-lg bg-gray-50">
          <CardHeader className="pb-2 flex items-center space-x-2">
            <Skeleton className="h-6 w-6 rounded-full" />
            <Skeleton className="h-5 w-1/2" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-1/3" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
