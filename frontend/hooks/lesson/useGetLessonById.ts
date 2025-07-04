import { getLessonById } from "@/api/lesson";
import { ILesson } from "@/types/lesson";
import { useQuery } from "@tanstack/react-query";

export const useGetLessonById = (lessonId: string) => {
	return useQuery<ILesson, Error>({
		queryKey: ["lesson", lessonId],
		queryFn: () => getLessonById(lessonId),
		enabled: !!lessonId,
		retry: 1,
		staleTime: 5 * 60 * 1000,
	});
};
