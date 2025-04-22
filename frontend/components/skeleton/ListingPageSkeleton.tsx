import { Skeleton } from "@/components/ui/skeleton";

interface PageSkeletonProps {
  statsCount?: number; // Number of stats cards (default: 3)
  tableColumns?: number; // Number of table columns (default: 3)
  tableRows?: number; // Number of table rows (default: 5)
  showPagination?: boolean; // Show pagination skeleton (default: true)
  showHeader?: boolean; // Show header skeleton (default: true)
}

export function PageSkeleton({
  statsCount = 3,
  tableColumns = 3,
  tableRows = 5,
  showPagination = true,
  showHeader = true,
}: PageSkeletonProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      {showHeader && (
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-9 w-64" />
            <Skeleton className="h-5 w-96 mt-1" />
          </div>
          {/* Placeholder for buttons (e.g., InstructorsPage's Requests) */}
          <Skeleton className="h-10 w-32 hidden md:block" />
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[...Array(statsCount)].map((_, i) => (
          <div key={i} className="border rounded-lg p-4 bg-white shadow-sm">
            <Skeleton className="h-6 w-1/2 mb-2" />
            <Skeleton className="h-8 w-1/3" />
          </div>
        ))}
      </div>

      {/* Table Controls */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <Skeleton className="h-10 w-full md:w-1/3" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-10" />
        </div>
      </div>

      {/* Data Table */}
      <div className="border rounded-lg bg-white">
        {/* Table Header */}
        <div className="grid grid-cols-[repeat(var(--columns),1fr)] gap-4 p-4 border-b">
          {[...Array(tableColumns)].map((_, i) => (
            <Skeleton key={i} className="h-6 w-24" />
          ))}
          {/* Actions column */}
          <Skeleton className="h-6 w-16" />
        </div>
        {/* Table Rows */}
        {[...Array(tableRows)].map((_, rowIndex) => (
          <div
            key={rowIndex}
            className="grid grid-cols-[repeat(var(--columns),1fr)] gap-4 p-4 border-b"
            style={{ "--columns": tableColumns + 1 } as React.CSSProperties}
          >
            {[...Array(tableColumns)].map((_, colIndex) => (
              <Skeleton key={colIndex} className="h-6 w-full" />
            ))}
            {/* Actions column */}
            <Skeleton className="h-8 w-20" />
          </div>
        ))}
      </div>

      {/* Pagination */}
      {showPagination && (
        <div className="mt-4 flex justify-end">
          <Skeleton className="h-10 w-64" />
        </div>
      )}
    </div>
  );
}
