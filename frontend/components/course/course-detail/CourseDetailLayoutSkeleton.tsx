import { Skeleton } from "@/components/ui/skeleton";

export default function CourseDetailLayoutSkeleton() {
  return (
    <div className="min-h-screen p-4 sm:p-8 bg-white dark:bg-[#18181b] flex justify-center">
      <div className="w-full max-w-5xl p-6 space-y-8">
        {/* Header Skeleton */}
        <div className="flex flex-col sm:flex-row gap-6 items-center">
          <Skeleton className="w-40 h-40 rounded-xl" />
          <div className="flex-1 space-y-2 text-center sm:text-left">
            <Skeleton className="h-8 w-2/3 mx-auto sm:mx-0 rounded" />
            <div className="flex flex-wrap gap-2 justify-center sm:justify-start items-center">
              <Skeleton className="h-6 w-24 rounded-full" />
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-6 w-28 rounded-full" />
            </div>
            <div className="flex flex-wrap gap-3 items-center justify-center sm:justify-start mt-2">
              <Skeleton className="h-8 w-24 rounded" />
              <Skeleton className="h-6 w-16 rounded" />
              <Skeleton className="h-10 w-32 rounded" />
            </div>
            <Skeleton className="h-5 w-full sm:w-3/4 mt-2 rounded" />
          </div>
        </div>
        {/* Instructor Skeleton */}
        <div className="flex items-center gap-4">
          <Skeleton className="w-14 h-14 rounded-full" />
          <div className="flex-1">
            <Skeleton className="h-6 w-32 mb-2 rounded" />
            <Skeleton className="h-4 w-48 rounded" />
          </div>
        </div>
        {/* About Skeleton */}
        <div>
          <Skeleton className="h-6 w-48 mb-2 rounded" />
          <Skeleton className="h-4 w-full mb-1 rounded" />
          <Skeleton className="h-4 w-3/4 rounded" />
        </div>
        {/* Syllabus Skeleton */}
        <div>
          <Skeleton className="h-6 w-32 mb-2 rounded" />
          <div className="space-y-3">
            {[1,2,3].map(i => (
              <div key={i} className="flex items-start gap-3">
                <Skeleton className="h-6 w-6 rounded" />
                <div className="flex-1">
                  <Skeleton className="h-5 w-40 mb-1 rounded" />
                  <Skeleton className="h-4 w-64 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Features Skeleton */}
        <div>
          <Skeleton className="h-6 w-48 mb-2 rounded" />
          <div className="space-y-3">
            {[1,2,3,4].map(i => (
              <div key={i} className="flex items-center gap-2">
                <Skeleton className="w-4 h-4 rounded" />
                <Skeleton className="h-4 w-40 rounded" />
              </div>
            ))}
          </div>
        </div>
        {/* Details Skeleton */}
        <div>
          <Skeleton className="h-6 w-40 mb-2 rounded" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1,2,3,4].map(i => (
              <div key={i}>
                <Skeleton className="h-5 w-32 mb-1 rounded" />
                <Skeleton className="h-4 w-48 rounded" />
              </div>
            ))}
          </div>
        </div>
        {/* Reviews Skeleton */}
        <div>
          <Skeleton className="h-6 w-32 mb-2 rounded" />
          <div className="space-y-4">
            {[1,2,3].map(i => (
              <Skeleton key={i} className="h-24 w-full rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 