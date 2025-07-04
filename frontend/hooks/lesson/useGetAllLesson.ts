import { getAllLessonsInCourse } from "@/api/lesson";
import { useAuthStore } from "@/stores/auth.store";
import { GetAllLessonsParams, GetAllLessonsResponse } from "@/types/lesson";
import { useQuery } from "@tanstack/react-query";

export const useGetAllLessonsInCourse = ({
	courseId,
	page = 1,
	limit = 10,
	sortBy = "order",
	sortOrder = "asc",
	search = "",
	filterBy = "ALL",
	includeDeleted = false,
}: GetAllLessonsParams) => {
	const { user } = useAuthStore();

	return useQuery<GetAllLessonsResponse, Error>({
		queryKey: [
			"lessons",
			courseId,
			{ page, limit, sortBy, sortOrder, search, filterBy, includeDeleted },
		],
		queryFn: () =>
			getAllLessonsInCourse({
				courseId,
				page,
				limit,
				sortBy,
				sortOrder,
				search,
				filterBy,
				includeDeleted,
			}),
		enabled: !!user?.id && !!courseId,
		retry: 1,
		staleTime: 5 * 60 * 1000,
	});
};
