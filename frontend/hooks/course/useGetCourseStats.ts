import { useQuery } from "@tanstack/react-query";
import { getCourseStats } from "@/api/course";
import { CourseStats } from "@/types/dashboard";

export interface UseGetCourseStatsReturn {
	data: CourseStats | undefined;
	isLoading: boolean;
	error: { message: string } | null;
	refetch: () => void;
}

export function useGetCourseStats(): UseGetCourseStatsReturn {
	const { data, isLoading, error, refetch } = useQuery<CourseStats>({
		queryKey: ["course-stats"],
		queryFn: async () => {
			const response = await getCourseStats();
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
		data,
		isLoading,
		error: mappedError,
		refetch,
	};
}
