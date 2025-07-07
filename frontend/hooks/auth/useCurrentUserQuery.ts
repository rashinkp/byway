import { useQuery } from "@tanstack/react-query";
import { getUserData } from "@/api/users";
import { User } from "@/types/user";

export function useCurrentUserQuery() {
  return useQuery<User>({
    queryKey: ["currentUser"],
    queryFn: getUserData,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000,   // 10 minutes
    retry: (failureCount, error) => {
      if (error.message.includes("401") || error.message.includes("403")) {
        return false;
      }
      return failureCount < 3;
    },
  });
} 