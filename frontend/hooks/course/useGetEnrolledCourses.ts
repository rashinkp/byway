"use client";

import { useQuery } from "@tanstack/react-query";
import {
	IGetEnrolledCoursesInput,
	Course,
	CourseApiResponse,
} from "@/types/course";
import { getEnrolledCourses } from "@/api/course";

interface UseEnrolledCoursesReturn {
	data: { items: Course[]; total: number; totalPages: number } | undefined;
	isLoading: boolean;
	error: { message: string } | null;
	refetch: () => void;
}

export function useGetEnrolledCourses({
	page = 1,
	limit = 10,
	search = "",
	sortOrder = "desc",
	sortBy = "enrolledAt",
	level = "All",
}: IGetEnrolledCoursesInput): UseEnrolledCoursesReturn {
	let adjustedSortBy: IGetEnrolledCoursesInput["sortBy"] = sortBy;
	let adjustedSortOrder: IGetEnrolledCoursesInput["sortOrder"] = sortOrder;

	// Handle negative sortBy (e.g., "-title" for descending)
	if (sortBy?.startsWith("-")) {
		adjustedSortBy = sortBy.slice(1) as IGetEnrolledCoursesInput["sortBy"];
		adjustedSortOrder = sortOrder === "asc" ? "desc" : "asc";
	}

	const { data, isLoading, error, refetch } = useQuery<CourseApiResponse>({
		queryKey: [
			"enrolledCourses",
			page,
			limit,
			search,
			sortBy,
			sortOrder,
			level,
		],
		queryFn: async () => {
			const response = await getEnrolledCourses({
				page,
				limit,
				search,
				sortOrder: adjustedSortOrder,
				sortBy: adjustedSortBy,
				level,
			});
			return response;
		},
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
		data: data
			? {
					items: data.courses,
					total: data.total,
					totalPages: data.totalPage,
				}
			: undefined,
		isLoading,
		error: mappedError,
		refetch,
	};
}
