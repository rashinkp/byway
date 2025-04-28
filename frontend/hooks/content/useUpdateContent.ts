import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UpdateLessonContentInput, LessonContent } from "@/types/content";
import { z } from "zod";
import { updateContentSchema } from "@/lib/validations/content";
import { updateContent } from "@/api/content";

export const useUpdateContent = () => {
  const queryClient = useQueryClient();

  return useMutation<LessonContent, Error, UpdateLessonContentInput>({
    mutationFn: async (data) => {
      const validatedData = updateContentSchema.parse(data);
      if (!validatedData.lessonId) {
        throw new Error("Lesson ID is required");
      }
      return updateContent(validatedData as UpdateLessonContentInput);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["content", data.lessonId] });
      queryClient.invalidateQueries({ queryKey: ["lesson", data.lessonId] });
    },
    onError: (error) => {
      console.error("Update content error:", error.message);
    },
  });
};
