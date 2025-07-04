import { Skeleton } from "@/components/ui/skeleton";

export function CartItemSkeleton() {
	return (
		<div className="p-6 border-b last:border-b-0">
			<div className="flex gap-4">
				<Skeleton className="w-32 h-20 rounded-lg flex-shrink-0" />
				<div className="flex-1">
					<div className="flex justify-between items-start">
						<div>
							<Skeleton className="h-6 w-3/4 mb-2" />
							<Skeleton className="h-4 w-1/2" />
						</div>
						<Skeleton className="h-5 w-5 rounded-full" />
					</div>
					<div className="flex items-center mt-3 space-x-4">
						<Skeleton className="h-4 w-16" />
						<Skeleton className="h-4 w-16" />
						<Skeleton className="h-4 w-16" />
					</div>
				</div>
				<div className="text-right min-w-[120px]">
					<Skeleton className="h-6 w-16 ml-auto mb-1" />
					<Skeleton className="h-4 w-12 ml-auto mb-1" />
					<Skeleton className="h-5 w-16 ml-auto" />
				</div>
			</div>
		</div>
	);
}
