"use client";

import { useQuery } from "@tanstack/react-query";
import {
	QueryCourseReviewParams,
	CourseReviewApiResponse,
	Review,
} from "@/types/course-review";
import { getCourseReviews } from "@/api/course-review";

interface UseGetCourseReviewsReturn {
	data: { items: Review[]; total: number; totalPages: number } | undefined;
	isLoading: boolean;
	error: { message: string } | null;
	refetch: () => void;
}

export function useGetCourseReviews(
	courseId: string,
	params: QueryCourseReviewParams = {} as QueryCourseReviewParams,
): UseGetCourseReviewsReturn {
	const {
		page = 1,
		limit = 10,
		rating,
		sortBy = "createdAt",
		sortOrder = "desc",
		isMyReviews = false,
		includeDisabled = false,
	} = params;

	const { data, isLoading, error, refetch } = useQuery<CourseReviewApiResponse>(
		{
			queryKey: [
				"course-reviews",
				courseId,
				{
					page,
					limit,
					rating,
					sortBy,
					sortOrder,
					isMyReviews,
					includeDisabled,
				},
			],
			queryFn: async () => {
				const response = await getCourseReviews(courseId, {
					page,
					limit,
					rating,
					sortBy,
					sortOrder,
					isMyReviews,
					includeDisabled,
				});
				return response;
			},
			enabled: !!courseId,
		},
	);

	const mappedError = error
		? {
				message:
					error instanceof Error
						? error.message
						: "An unexpected error occurred",
			}
		: null;

	return {
		data: data
			? {
					items: data.reviews,
					total: data.total,
					totalPages: data.totalPages,
				}
			: undefined,
		isLoading,
		error: mappedError,
		refetch,
	};
}
