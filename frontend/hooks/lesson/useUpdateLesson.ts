import { updateLesson } from "@/api/lesson";
import { ILesson } from "@/types/lesson";
import { useMutation, useQueryClient } from "@tanstack/react-query";

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
      thumbnail?: string;
      duration?: number;
    }
  >({
    mutationFn: ({ lessonId, ...data }) => updateLesson(lessonId, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["lessons", data.courseId] });
    },
  });
};
