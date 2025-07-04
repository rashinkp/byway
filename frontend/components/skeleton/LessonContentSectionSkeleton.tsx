"use client";

import { Skeleton } from "@/components/ui/skeleton";

export const ContentSectionSkeleton = () => {
	return (
		<div className="p-6" aria-busy="true">
			{/* Title (Lesson Content) */}
			<Skeleton className="h-6 w-1/4 mb-4" />

			{/* Content Area */}
			<div className="space-y-4">
				{/* Subtitle (content.title) */}
				<Skeleton className="h-5 w-1/3" />

				{/* Description (content.description) */}
				<Skeleton className="h-4 w-3/4" />

				{/* Content Placeholder (video, document, or quiz) */}
				<div className="space-y-2">
					{/* Placeholder for video or quiz questions */}
					<Skeleton className="h-48 w-full" />
					{/* Placeholder for quiz question or document link */}
					<Skeleton className="h-4 w-1/2" />
				</div>

				{/* Action Buttons (Edit and Delete) */}
				<div className="flex space-x-4 mt-4">
					<Skeleton className="h-10 w-24" />
					<Skeleton className="h-10 w-24" />
				</div>
			</div>
		</div>
	);
};
