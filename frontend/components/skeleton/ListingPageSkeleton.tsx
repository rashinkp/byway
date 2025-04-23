import { Skeleton } from "@/components/ui/skeleton";
import { StatsSkeleton } from "@/components/skeleton/StatsSkeleton";
import { TableSkeleton } from "@/components/skeleton/DataTableSkeleton";

interface PageSkeletonProps {
  statsCount?: number; // Number of stats cards
  tableColumns?: number; // Number of table columns (excluding actions)
  tableRows?: number; // Number of table rows
  showPagination?: boolean; // Show pagination skeleton
  showHeader?: boolean; // Show header skeleton
  hasActions?: boolean; // Include actions column in table
}

export function PageSkeleton({
  statsCount = 3,
  tableColumns = 3,
  tableRows = 5,
  showPagination = true,
  showHeader = true,
  hasActions = true,
}: PageSkeletonProps) {
  return (
    <div className="space-y-6">
      {showHeader && (
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-9 w-64" />
            <Skeleton className="h-5 w-96 mt-1" />
          </div>
          <Skeleton className="h-10 w-32 hidden md:block" />
        </div>
      )}

      <StatsSkeleton count={statsCount} />

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <Skeleton className="h-10 w-full md:w-1/3" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-10" />
        </div>
      </div>

      <TableSkeleton columns={tableColumns} rows={tableRows} hasActions={hasActions} />

      {showPagination && (
        <div className="mt-4 flex justify-end">
          <Skeleton className="h-10 w-64" />
        </div>
      )}
    </div>
  );
}
