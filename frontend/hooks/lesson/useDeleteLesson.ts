import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteLesson } from "@/api/lesson";

export const useDeleteLesson = (courseId: string) => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: deleteLesson,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lessons", courseId] });
    },
  });
};
