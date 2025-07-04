import { Skeleton } from "@/components/ui/skeleton";

export function CourseCardSkeleton() {
	return (
		<div className="bg-white rounded-lg shadow-sm overflow-hidden">
			{/* Thumbnail Skeleton */}
			<Skeleton className="w-full h-48" />

			<div className="p-4">
				{/* Title Skeleton */}
				<Skeleton className="h-6 w-3/4 mb-2" />

				{/* Instructor Skeleton */}
				<Skeleton className="h-4 w-1/2 mb-3" />

				{/* Rating Skeleton */}
				<div className="flex items-center gap-2 mb-3">
					<Skeleton className="h-4 w-20" />
					<Skeleton className="h-4 w-16" />
				</div>

				{/* Price Skeleton */}
				<div className="flex items-center gap-2">
					<Skeleton className="h-6 w-16" />
					<Skeleton className="h-4 w-12" />
				</div>
			</div>
		</div>
	);
}
