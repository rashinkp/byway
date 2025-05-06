"use client";

import { useQuery } from "@tanstack/react-query";
import { User } from "@/types/user";
import { getUserData, getUserDataById } from "@/api/users";

export interface UseUserDataReturn {
  data: User | undefined;
  isLoading: boolean;
  error: { message: string; code?: string } | null;
  refetch: () => void;
}

// Hook for fetching the current user's data
export function useUserData(): UseUserDataReturn {
  const { data, isLoading, error, refetch } = useQuery<User>({
    queryKey: ["userData"],
    queryFn: async () => {
      const userData = await getUserData();
      return userData;
    },
  });

  const mappedError = error
    ? {
        message:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
        code:
          error instanceof Error && "code" in error
            ? (error as any).code
            : undefined,
      }
    : null;

  return {
    data,
    isLoading,
    error: mappedError,
    refetch,
  };
}


