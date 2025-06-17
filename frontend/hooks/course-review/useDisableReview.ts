"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { disableReview } from "@/api/course-review";
import { DisableReviewResponse } from "@/types/course-review";

interface UseDisableReviewReturn {
  disableReview: (reviewId: string) => Promise<DisableReviewResponse>;
  isLoading: boolean;
  error: { message: string } | null;
}

export function useDisableReview(courseId?: string): UseDisableReviewReturn {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending, error } = useMutation<
    DisableReviewResponse,
    Error,
    string
  >({
    mutationFn: async (reviewId: string) => {
      const response = await disableReview(reviewId);
      return response;
    },
    onSuccess: () => {
      // Invalidate course reviews cache
      if (courseId) {
        queryClient.invalidateQueries({
          queryKey: ["course-reviews", courseId],
        });
      }
      // Also invalidate course data to refresh review stats
      queryClient.invalidateQueries({
        queryKey: ["course", courseId],
      });
    },
  });

  const mappedError = error
    ? {
        message: error instanceof Error ? error.message : "An unexpected error occurred",
      }
    : null;

  return {
    disableReview: mutateAsync,
    isLoading: isPending,
    error: mappedError,
  };
} 