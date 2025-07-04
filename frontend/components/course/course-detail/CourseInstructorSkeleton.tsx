import { Skeleton } from "@/components/ui/skeleton";

export default function CourseInstructorSkeleton() {
	return (
		<div className="space-y-6 animate-pulse">
			<div className="flex items-start space-x-4">
				<Skeleton className="w-16 h-16 rounded-full" />
				<div className="space-y-2 flex-1">
					<Skeleton className="h-4 w-1/3" />
					<Skeleton className="h-4 w-1/4" />
				</div>
			</div>
			<div className="space-y-4">
				<Skeleton className="h-4 w-full" />
				<Skeleton className="h-4 w-5/6" />
				<Skeleton className="h-4 w-4/6" />
			</div>
		</div>
	);
}
