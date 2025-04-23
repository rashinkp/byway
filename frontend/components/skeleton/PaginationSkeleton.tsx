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
    <div className={`flex items-center justify-center space-x-2 ${className}`}>
      <Skeleton className="h-8 w-8 rounded-md" /> {/* Previous button */}
      {[...Array(maxVisiblePages)].map((_, i) => (
        <Skeleton key={i} className="h-8 w-8 rounded-md" /> /* Page buttons */
      ))}
      <Skeleton className="h-8 w-8 rounded-md" /> {/* Next button */}
    </div>
  );
}