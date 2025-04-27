import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateLessonContentInput, LessonContent } from "@/types/content";
import { z } from "zod";
import { createContentSchema } from "@/lib/validations/content";
import { createContent } from "@/api/content";

export const useCreateContent = () => {
  const queryClient = useQueryClient();

  return useMutation<LessonContent, Error, CreateLessonContentInput>({
    mutationFn: async (data) => {
      console.log(data);
      const validatedData = createContentSchema.parse(data);
      return createContent(validatedData);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["content", data.lessonId] });
      queryClient.invalidateQueries({ queryKey: ["lesson", data.lessonId] });
    },
    onError: (error) => {
      console.error("Create content error:", error.message);
    },
  });
};
