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
    },
    { previousLesson?: ILesson }
  >({
    mutationFn: ({ lessonId, ...data }) => updateLesson(lessonId, data),
    onMutate: async (variables) => {
      await queryClient.cancelQueries({
        queryKey: ["lesson", variables.lessonId],
      });
      const previousLesson = queryClient.getQueryData<ILesson>([
        "lesson",
        variables.lessonId,
      ]);

      queryClient.setQueryData<ILesson>(
        ["lesson", variables.lessonId],
        (old) => {
          if (!old) return old;
          return {
            ...old,
            ...variables,
            id: old.id,
            courseId: old.courseId,
          };
        }
      );

      return { previousLesson };
    },
    onError: (err, variables, context) => {
      // Rollback if error occurs
      if (context?.previousLesson) {
        queryClient.setQueryData(
          ["lesson", variables.lessonId],
          context.previousLesson
        );
      }
      toast.error("Failed to update lesson", {
        description: err.message || "Please try again",
      });
    },
    onSuccess: (data, variables) => {
      queryClient.setQueryData(
        ["lesson", variables.lessonId],
        data
      );
    },
  });
};
