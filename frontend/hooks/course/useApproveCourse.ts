import { approveCourse, declineCourse } from "@/api/course";
import { Course } from "@/types/course";
import { IUpdateCourseApprovalInput } from "@/types/course";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface UseCourseApprovalReturn {
  mutate: (input: IUpdateCourseApprovalInput) => void;
  isPending: boolean;
  error: { message: string } | null;
}

export function useApproveCourse(): UseCourseApprovalReturn {
  const queryClient = useQueryClient();

  const { mutate, isPending, error } = useMutation<
    Course,
    Error,
    IUpdateCourseApprovalInput
  >({
    mutationFn: approveCourse,
    onSuccess: () => {
      // Invalidate courses query to refetch updated course list
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
    onError: (err) => {
      console.error("Course approval failed:", err);
    },
  });

  return {
    mutate,
    isPending,
    error: error ? { message: error.message } : null,
  };
}

export function useDeclineCourse(): UseCourseApprovalReturn {
  const queryClient = useQueryClient();

  const { mutate, isPending, error } = useMutation<
    Course,
    Error,
    IUpdateCourseApprovalInput
  >({
    mutationFn: declineCourse,
    onSuccess: () => {
      // Invalidate courses query to refetch updated course list
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
    onError: (err) => {
      console.error("Course decline failed:", err);
    },
  });

  return {
    mutate,
    isPending,
    error: error ? { message: error.message } : null,
  };
}
