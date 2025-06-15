import { useQuery } from "@tanstack/react-query";
import { getAdminDashboard } from "@/api/dashboard";
import { DashboardResponse } from "@/types/dashboard";

export function useAdminDashboard() {
  return useQuery<DashboardResponse, Error>({
    queryKey: ["admin-dashboard"],
    queryFn: getAdminDashboard,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: (failureCount, error) => {
      // Don't retry on 401/403 errors
      if (error.message.includes('401') || error.message.includes('403')) {
        return false;
      }
      return failureCount < 3;
    },
  });
} 