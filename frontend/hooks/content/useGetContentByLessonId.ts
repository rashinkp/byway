import { useQuery } from "@tanstack/react-query";
import { LessonContent } from "@/types/content";
import { getContentSchema } from "@/lib/validations/content";
import { getContentByLessonId } from "@/api/content";

export const useGetContentByLessonId = (lessonId: string) => {
	return useQuery<LessonContent | null, Error>({
		queryKey: ["content", lessonId],
		queryFn: async () => {
			const validatedLessonId = getContentSchema.parse({ lessonId }).lessonId;
			return getContentByLessonId(validatedLessonId);
		},
		enabled: !!lessonId,
	});
};
