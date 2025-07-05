import { Skeleton } from "@/components/ui/skeleton";

export function LessonContentSkeleton() {
  return (
    <div className="max-w-4xl mx-auto relative">
      <div className="space-y-6">
        {/* Title and description skeleton */}
        <div className="space-y-3">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>

        {/* Content card skeleton */}
        <div className="bg-[var(--color-surface)] shadow-xl rounded-xl overflow-hidden">
          <div className="p-6 space-y-4">
            <Skeleton className="h-6 w-2/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>

          {/* Video/document skeleton */}
          <div className="p-6">
            <Skeleton className="aspect-video w-full rounded-lg" />
          </div>

          {/* Bottom section skeleton */}
          <div className="p-6 border-t border-[var(--color-primary-light)]/20 bg-[var(--color-background)] flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Skeleton className="h-6 w-6 rounded-full" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
      </div>
    </div>
  );
} 