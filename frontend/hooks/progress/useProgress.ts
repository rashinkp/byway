"use client";

import { useQuery } from "@tanstack/react-query";
import { getProgress } from "@/api/progress";
import { IProgress, IGetProgressInput } from "@/types/progress";

interface UseProgressReturn {
  data: IProgress | undefined;
  isLoading: boolean;
  error: { message: string } | null;
  refetch: () => void;
}

export function useProgress({ courseId }: IGetProgressInput): UseProgressReturn {
  const { data, isLoading, error, refetch } = useQuery<IProgress>({
    queryKey: ["progress", courseId],
    queryFn: () => getProgress({ courseId }),
    enabled: !!courseId,
  });

  const mappedError = error
    ? {
        message:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      }
    : null;

  return {
    data,
    isLoading,
    error: mappedError,
    refetch,
  };
} 