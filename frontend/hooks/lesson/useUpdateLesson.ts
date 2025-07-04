// src/hooks/lesson/useUpdateLesson.ts
import { updateLesson } from "@/api/lesson";
import { ILesson } from "@/types/lesson";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useUpdateLesson = () => {
	const queryClient = useQueryClient();

	return useMutation<
		ILesson,
		Error,
		{
			lessonId: string;
			title?: string;
			description?: string;
			order?: number;
			duration?: number;
		}
	>({
		mutationFn: ({ lessonId, ...data }) => updateLesson(lessonId, data),
		onSuccess: (data, variables) => {
			// Invalidate the lesson list query (for course lessons)
			queryClient.invalidateQueries({ queryKey: ["lessons", data.courseId] });
			// Invalidate the individual lesson query
			queryClient.invalidateQueries({
				queryKey: ["lesson", variables.lessonId],
			});
			// Optionally, update the cache directly to avoid refetching
			queryClient.setQueryData(["lesson", variables.lessonId], data);
			toast.success("Lesson Updated", {
				description: "The lesson has been updated successfully.",
			});
		},
		onError: (error) => {
			toast.error("Failed to update lesson", {
				description: error.message || "Please try again",
			});
			console.error("Failed to update lesson:", error);
		},
	});
};
