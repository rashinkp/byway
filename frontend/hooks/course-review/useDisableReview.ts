"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DisableReviewResponse } from "@/types/course-review";
import { disableReview } from "@/api/course-review";

interface UseDisableReviewReturn {
  disableReview: (id: string) => Promise<DisableReviewResponse>;
  isLoading: boolean;
  error: { message: string } | null;
}

export function useDisableReview(): UseDisableReviewReturn {
  const queryClient = useQueryClient();

  const {
    mutateAsync,
    isPending: isLoading,
    error,
  } = useMutation<DisableReviewResponse, Error, string>({
    mutationFn: disableReview,
    onSuccess: () => {
      // Invalidate all course review related queries
      queryClient.invalidateQueries({
        queryKey: ["course-reviews"],
      });
      queryClient.invalidateQueries({
        queryKey: ["course-review-stats"],
      });
      queryClient.invalidateQueries({
        queryKey: ["user-reviews"],
      });
    },
  });

  const mappedError = error
    ? {
        message: error.message || "Failed to disable review",
      }
    : null;

  return {
    disableReview: mutateAsync,
    isLoading,
    error: mappedError,
  };
} 