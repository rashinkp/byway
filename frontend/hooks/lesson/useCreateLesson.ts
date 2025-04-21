import { createLesson } from "@/api/lesson";
import { ILesson } from "@/types/lesson";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateLesson = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ILesson,
    Error,
    {
      courseId: string;
      title: string;
      description?: string;
      order: number;
      thumbnail?: string;
      duration?: number;
    }
  >({
    mutationFn: createLesson,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["lessons", data.courseId] });
    },
  });
};
