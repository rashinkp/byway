import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UpdateLessonContentInput, LessonContent } from "@/types/content";
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
      return updateContent({
        ...validatedData,
        lessonId: validatedData.lessonId as string,
      });
    },
    onSuccess: (data) => {
      queryClient.setQueryData<LessonContent>(["content", data.lessonId], data);

      queryClient.setQueryData(["lesson", data.lessonId], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          content: data, 
        };
      });
    },
    onError: (error) => {
      console.error("Update content error:", error.message);
    },
  });
};
