"use client";

import { useQuery } from "@tanstack/react-query";
import { GetUserReviewsParams, GetUserReviewsResponse } from "@/types/course-review";
import { getUserReviews } from "@/api/course-review";

interface UseGetUserReviewsReturn {
  data: { items: any[]; total: number; totalPages: number } | undefined;
  isLoading: boolean;
  error: { message: string } | null;
  refetch: () => void;
}

export function useGetUserReviews(
  params: GetUserReviewsParams = {}
): UseGetUserReviewsReturn {
  const { page = 1, limit = 10 } = params;

  const { data, isLoading, error, refetch } = useQuery<GetUserReviewsResponse>({
    queryKey: [
      "user-reviews",
      {
        page,
        limit,
      },
    ],
    queryFn: async () => {
      const response = await getUserReviews({
        page,
        limit,
      });
      return response;
    },
  });

  const mappedError = error
    ? {
        message: error instanceof Error ? error.message : "An unexpected error occurred",
      }
    : null;

  return {
    data: data
      ? {
          items: data.reviews,
          total: data.total,
          totalPages: data.totalPages,
        }
      : undefined,
    isLoading,
    error: mappedError,
    refetch,
  };
} 