import { Skeleton } from "../ui/skeleton";

export function DetailsSectionSkeleton() {
  return (
    <div className="p-6 rounded-xl shadow-sm border border-gray-100 space-y-8">
      {/* ImageSection Skeleton */}
      <Skeleton className="w-full h-48 rounded-lg" />

      {/* Edit Button Skeleton */}
      <div className="flex justify-end mb-4">
        <Skeleton className="h-10 w-32 rounded-md" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          <div>
            <Skeleton className="h-5 w-20" /> {/* Title Label */}
            <Skeleton className="mt-1 h-8 w-full" /> {/* Title Input */}
          </div>
          <div>
            <Skeleton className="h-5 w-20" /> {/* Id Label */}
            <Skeleton className="mt-1 h-8 w-full" /> {/* Id Input */}
          </div>
          <div>
            <Skeleton className="h-5 w-20" /> {/* Level Label */}
            <Skeleton className="mt-1 h-8 w-full" /> {/* Level Select */}
          </div>
          <div>
            <Skeleton className="h-5 w-20" /> {/* Price Label */}
            <Skeleton className="mt-1 h-8 w-32" /> {/* Price Input */}
          </div>
          <div>
            <Skeleton className="h-5 w-20" /> {/* Offer Price Label */}
            <Skeleton className="mt-1 h-8 w-32" /> {/* Offer Price Input */}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <div>
            <Skeleton className="h-5 w-20" /> {/* Duration Label */}
            <Skeleton className="mt-1 h-8 w-32" /> {/* Duration Input */}
          </div>
          <div>
            <Skeleton className="h-5 w-20" /> {/* Status Label */}
            <Skeleton className="mt-1 h-8 w-24" /> {/* Status Badge */}
          </div>
          <div>
            <Skeleton className="h-5 w-20" /> {/* Stage Label */}
            <Skeleton className="mt-1 h-8 w-24" /> {/* Stage Select */}
          </div>
          <div>
            <Skeleton className="h-5 w-20" /> {/* Created At Label */}
            <Skeleton className="mt-1 h-8 w-full" /> {/* Created At Input */}
          </div>
          <div>
            <Skeleton className="h-5 w-20" /> {/* Updated At Label */}
            <Skeleton className="mt-1 h-8 w-full" /> {/* Updated At Input */}
          </div>
        </div>
      </div>
      <div className="space-y-2">
        <Skeleton className="h-5 w-24" /> {/* Label */}
        <Skeleton className="h-20 w-full rounded-md" />{" "}
        {/* Textarea or description */}
      </div>

      {/* ObjectivesSection Skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-5 w-24" /> {/* Label */}
        <div className="space-y-2">
          {/* Simulate a list of objectives */}
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-5/6" />
        </div>
      </div>

      {/* ActionSection Skeleton */}
      <div className="flex justify-end gap-2 mt-6">
        <Skeleton className="h-10 w-24 rounded-md" />{" "}
        {/* Disable/Enable Button */}
        <Skeleton className="h-10 w-24 rounded-md" />{" "}
        {/* Publish/Unpublish Button */}
      </div>
    </div>
  );
}
