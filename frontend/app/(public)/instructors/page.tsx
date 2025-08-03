"use client";

import { useState } from "react";
import { Pagination } from "@/components/ui/Pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetAllInstructors } from "@/hooks/instructor/useGetAllInstructor";
import { InstructorCard } from "@/components/instructor/InstructorCard";
import { InstructorCardData } from "@/types/instructor";

export default function InstructorsPage() {
	const [page, setPage] = useState(1);
	const limit = 9;

	const { data, isLoading, error } = useGetAllInstructors({
		page,
		limit,
		sortBy: "createdAt",
		sortOrder: "desc",
		filterBy: "Approved",
		includeDeleted: false,
	});

	if (error) {
		return (
			<div className="text-center py-10">
				<p className="text-[var(--color-danger)]">{error.message}</p>
			</div>
		);
	}

	return (
		<div className="bg-[var(--color-background)]">
			<div className="container mx-auto py-8 max-w-5xl px-4">
				<div className="mb-20 text-center">
					<h1 className="text-3xl md:text-4xl font-bold mb-6">Browse Instructors</h1>
					<p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto dark:text-[#facc15]">
						Meet our expert instructors on Byway. Explore profiles, discover their expertise, and find the perfect mentor to guide your learning journey!
					</p>
				</div>
				{isLoading ? (
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
						{Array.from({ length: 6 }).map((_, index) => (
							<div
								key={index}
								className="bg-[var(--color-surface)] rounded-2xl shadow-lg p-8"
							>
								<div className="flex items-center gap-4">
									<Skeleton className="h-16 w-16 rounded-full" />
									<div className="space-y-2">
										<Skeleton className="h-4 w-32" />
										<Skeleton className="h-3 w-24" />
									</div>	
								</div>
								<Skeleton className="h-3 w-full mt-4" />
								<Skeleton className="h-3 w-2/3 mt-2" />
							</div>
						))}
					</div>
				) : (
					<>
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
							{data?.data.items.map((instructor: InstructorCardData) => (
								<InstructorCard
									key={instructor.id}
									instructor={{
										...instructor,
										user: {
											...instructor.user,
											avatar: instructor.user.avatar || "/UserProfile.jpg",
										},
									}}
								/>
							))}
						</div>
					</>
				)}
				<div className="mt-8 flex justify-center">
					<Pagination
						currentPage={page}
						totalPages={data?.data.totalPages || 1}
						onPageChange={setPage}
					/>
				</div>
			</div>
		</div>
	);
}
