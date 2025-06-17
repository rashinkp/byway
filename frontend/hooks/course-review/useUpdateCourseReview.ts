"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UpdateCourseReviewParams, CourseReview } from "@/types/course-review";
import { updateCourseReview } from "@/api/course-review";

interface UseUpdateCourseReviewReturn {
  updateReview: (id: string, data: UpdateCourseReviewParams) => Promise<CourseReview>;
  isLoading: boolean;
  error: { message: string } | null;
}

export function useUpdateCourseReview(): UseUpdateCourseReviewReturn {
  const queryClient = useQueryClient();

  const {
    mutateAsync,
    isPending: isLoading,
    error,
  } = useMutation<CourseReview, Error, { id: string; data: UpdateCourseReviewParams }>({
    mutationFn: ({ id, data }) => updateCourseReview(id, data),
    onSuccess: (data) => {
      // Invalidate and refetch course reviews
      queryClient.invalidateQueries({
        queryKey: ["course-reviews", data.courseId],
      });
      // Invalidate course review stats
      queryClient.invalidateQueries({
        queryKey: ["course-review-stats", data.courseId],
      });
      // Invalidate user reviews
      queryClient.invalidateQueries({
        queryKey: ["user-reviews"],
      });
      // Invalidate course data since it includes review stats
      queryClient.invalidateQueries({
        queryKey: ["course"],
      });
      queryClient.invalidateQueries({
        queryKey: ["courses"],
      });
    },
  });

  const mappedError = error
    ? {
        message: error.message || "Failed to update review",
      }
    : null;

  return {
    updateReview: (id: string, data: UpdateCourseReviewParams) => mutateAsync({ id, data }),
    isLoading,
    error: mappedError,
  };
} 