import { deleteContent } from "@/api/content";
import { deleteContentSchema } from "@/lib/validations/content";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useDeleteContent = (lessonId: string) => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: async (contentId) => {
      const validatedContentId = deleteContentSchema.parse({
        id: contentId,
      }).id;
      return deleteContent(validatedContentId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["content", lessonId] });
      queryClient.invalidateQueries({ queryKey: ["lesson", lessonId] });
    },
    onError: (error) => {
      console.error("Delete content error:", error.message);
    },
  });
};
