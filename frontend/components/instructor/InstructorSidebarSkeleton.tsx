export default function InstructorSidebarSkeleton() {
	return (
		<div className="bg-[var(--color-surface)]/95 border border-[var(--color-primary-light)]/20 shadow-lg rounded-2xl p-6 sticky top-8">
			<div className="space-y-8">
				{/* Admin Actions Skeleton */}
				<div className="space-y-4">
					<div className="h-5 w-24 bg-[var(--color-primary-light)]/50 rounded animate-pulse" />
					<div className="space-y-4">
						<div className="h-10 w-full bg-[var(--color-primary-light)]/50 rounded animate-pulse" />
						<div className="h-10 w-full bg-[var(--color-primary-light)]/50 rounded animate-pulse" />
						<div className="h-10 w-full bg-[var(--color-primary-light)]/50 rounded animate-pulse" />
					</div>
				</div>
			</div>
		</div>
	);
}
