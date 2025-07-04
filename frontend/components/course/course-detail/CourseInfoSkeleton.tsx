
export default function CourseInfoSkeleton() {
	return (
		<div className="bg-white/80 backdrop-blur-sm border border-gray-100 shadow-sm rounded-xl p-6 animate-pulse">
			<div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
			<div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
			<div className="flex gap-4 mb-6">
				<div className="h-12 w-12 bg-gray-200 rounded-full"></div>
				<div className="space-y-2">
					<div className="h-4 bg-gray-200 rounded w-24"></div>
					<div className="h-4 bg-gray-200 rounded w-32"></div>
				</div>
			</div>
		</div>
	);
}
