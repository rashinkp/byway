"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateCourseReviewParams, CourseReview } from "@/types/course-review";
import { createCourseReview } from "@/api/course-review";

interface UseCreateCourseReviewReturn {
  createReview: (data: CreateCourseReviewParams) => Promise<CourseReview>;
  isLoading: boolean;
  error: { message: string } | null;
}

export function useCreateCourseReview(): UseCreateCourseReviewReturn {
  const queryClient = useQueryClient();

  const {
    mutateAsync,
    isPending: isLoading,
    error,
  } = useMutation<CourseReview, Error, CreateCourseReviewParams>({
    mutationFn: createCourseReview,
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
        message: error.message || "Failed to create review",
      }
    : null;

  return {
    createReview: mutateAsync,
    isLoading,
    error: mappedError,
  };
} 