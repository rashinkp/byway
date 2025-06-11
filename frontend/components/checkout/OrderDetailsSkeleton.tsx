import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { BookOpen } from "lucide-react";

export default function OrderDetailsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-gray-900 mb-4">
        <BookOpen className="w-5 h-5 text-blue-600" />
        <h2 className="text-lg font-semibold">Order Details</h2>
      </div>
      <Separator />
      <div className="space-y-6">
        {[1, 2].map((index) => (
          <div key={index} className="flex gap-4">
            <Skeleton className="w-24 h-24 rounded-lg" />
            <div className="flex-1 space-y-3">
              <Skeleton className="h-5 w-3/4" />
              <div className="flex flex-wrap gap-4">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-24" />
              </div>
              <div className="flex items-center gap-2">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-4 w-20" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
