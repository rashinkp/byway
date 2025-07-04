"use client";

import { useQuery } from "@tanstack/react-query";
import { CourseReviewStats } from "@/types/course-review";
import { getCourseReviewStats } from "@/api/course-review";

interface UseGetCourseReviewStatsReturn {
	data: CourseReviewStats | undefined;
	isLoading: boolean;
	error: { message: string } | null;
	refetch: () => void;
}

export function useGetCourseReviewStats(
	courseId: string,
): UseGetCourseReviewStatsReturn {
	const { data, isLoading, error, refetch } = useQuery<CourseReviewStats>({
		queryKey: ["course-review-stats", courseId],
		queryFn: async () => {
			const response = await getCourseReviewStats(courseId);
			return response;
		},
		enabled: !!courseId,
	});

	const mappedError = error
		? {
				message:
					error instanceof Error
						? error.message
						: "An unexpected error occurred",
			}
		: null;

	return {
		data,
		isLoading,
		error: mappedError,
		refetch,
	};
}
