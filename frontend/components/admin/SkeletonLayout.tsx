"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonLayout() {
	return (
		<div className="min-h-screen bg-gray-50/50 p-6">
			<div className="max-w-7xl mx-auto space-y-8">
				<Skeleton className="h-8 w-64" />
				<Skeleton className="h-4 w-96" />
			</div>
		</div>
	);
}
