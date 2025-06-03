import { Skeleton } from "@/components/ui/skeleton";

export function FilterSidebarSkeleton() {
  return (
    <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-100">
      {/* Title Skeleton */}
      <Skeleton className="h-6 w-24 mb-6" />

      {/* Sort By Section */}
      <div className="mb-6">
        <Skeleton className="h-4 w-16 mb-2" />
        <Skeleton className="h-10 w-full" />
      </div>

      {/* Category Section */}
      <div className="mb-6">
        <Skeleton className="h-4 w-20 mb-2" />
        <div className="space-y-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-2">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 w-32" />
            </div>
          ))}
        </div>
      </div>

      {/* Level Section */}
      <div className="mb-6">
        <Skeleton className="h-4 w-16 mb-2" />
        <div className="space-y-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-2">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 w-24" />
            </div>
          ))}
        </div>
      </div>

      {/* Price Section */}
      <div className="mb-6">
        <Skeleton className="h-4 w-16 mb-2" />
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-2">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 w-20" />
            </div>
          ))}
        </div>
      </div>

      {/* Duration Section */}
      <div className="mb-6">
        <Skeleton className="h-4 w-20 mb-2" />
        <div className="space-y-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-2">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 w-32" />
            </div>
          ))}
        </div>
      </div>

      {/* Clear Filters Button Skeleton */}
      <Skeleton className="h-10 w-full" />
    </div>
  );
} 