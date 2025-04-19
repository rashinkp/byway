"use client";

import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "@/api/auth";
import { useAuthStore } from "@/stores/auth.store";
import { useEffect } from "react";

export function useAuth() {
  const { user, setUser } = useAuthStore();

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["auth"],
    queryFn: getCurrentUser,
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  useEffect(() => {
    if (data !== undefined) {
      setUser(data);
    }
  }, [data, setUser]);

  return {
    user,
    isLoading: isLoading || isFetching,
    isAuthenticated: !!user,
  };
}
