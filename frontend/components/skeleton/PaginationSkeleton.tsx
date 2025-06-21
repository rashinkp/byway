import { Skeleton } from "@/components/ui/skeleton";

interface PaginationSkeletonProps {
  maxVisiblePages?: number; // Number of placeholder page buttons
  className?: string;
}

export function PaginationSkeleton({
  maxVisiblePages = 5,
  className = "",
}: PaginationSkeletonProps) {
  return (
    <div className={`flex items-center justify-between pt-6 border-t border-gray-200 ${className}`}>
      <Skeleton className="h-4 w-48" /> {/* Results info */}
      <div className="flex items-center gap-2">
        <Skeleton className="h-10 w-20 rounded-lg" /> {/* Previous button */}
        {[...Array(maxVisiblePages)].map((_, i) => (
          <Skeleton key={i} className="h-10 w-10 rounded-lg" /> /* Page buttons */
        ))}
        <Skeleton className="h-10 w-16 rounded-lg" /> {/* Next button */}
      </div>
    </div>
  );
}