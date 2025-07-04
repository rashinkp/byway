import { deleteLesson } from "@/api/lesson";
import { ILesson } from "@/types/lesson";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useDeleteLesson = () => {
	const queryClient = useQueryClient();

	return useMutation<ILesson, Error, { lessonId: string; enable: boolean }>({
		mutationFn: ({ lessonId }) => deleteLesson(lessonId),
		onSuccess: (updatedLesson, { lessonId }) => {
			queryClient.invalidateQueries({ queryKey: ["lesson", lessonId] });
			queryClient.invalidateQueries({ queryKey: ["lessons"] });
			toast.success(
				updatedLesson.deletedAt ? "Lesson disabled" : "Lesson enabled",
				{
					description: updatedLesson.deletedAt
						? "The lesson has been disabled and removed from the course."
						: "The lesson has been enabled and added back to the course.",
				},
			);
		},
		onError: (error) => {
			toast.error(error.message || "Failed to toggle lesson status");
		},
	});
};
