"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteCourseReview } from "@/api/course-review";

interface UseDeleteCourseReviewReturn {
  deleteReview: (id: string) => Promise<void>;
  isLoading: boolean;
  error: { message: string } | null;
}

export function useDeleteCourseReview(): UseDeleteCourseReviewReturn {
  const queryClient = useQueryClient();

  const {
    mutateAsync,
    isPending: isLoading,
    error,
  } = useMutation<void, Error, string>({
    mutationFn: deleteCourseReview,
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
      // Invalidate course data since it includes review stats
      queryClient.invalidateQueries({
        queryKey: ["course"],
      });
    },
  });

  const mappedError = error
    ? {
        message: error.message || "Failed to delete review",
      }
    : null;

  return {
    deleteReview: mutateAsync,
    isLoading,
    error: mappedError,
  };
} 