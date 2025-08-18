import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateLessonContentInput, LessonContent } from "@/types/content";
import { z } from "zod";
import { createContentSchema } from "@/lib/validations/content";
import { createContent } from "@/api/content";
import { toast } from "sonner";

export const useCreateContent = () => {
	const queryClient = useQueryClient();

	return useMutation<LessonContent, Error, CreateLessonContentInput>({
		mutationFn: async (data) => {
			try {
				const validatedData = createContentSchema.parse(data);
				return await createContent(validatedData);
			} catch (error) {
				console.error("Content creation error:", error);
				if (error instanceof z.ZodError) {
					const errorMessage = error.errors.map((e) => e.message).join(", ");
					throw new Error(`Validation error: ${errorMessage}`);
				}
				if (error instanceof Error) {
					throw error;
				}
				throw new Error("An unexpected error occurred while creating content");
			}
		},
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: ["content", data.lessonId] });
			queryClient.invalidateQueries({ queryKey: ["lesson", data.lessonId] });
			toast.success("Content created successfully");
		},
		onError: (error) => {
			console.error("Create content error:", error);
			toast.error(error.message || "Failed to create content");
		},
	});
};
