import { useQuery } from '@tanstack/react-query';
import { analyticsApi } from '@/api/revenue';
import { GetOverallRevenueParams, GetCourseRevenueParams, GetLatestRevenueParams } from '@/types/analytics';

export const useOverallRevenue = (params: GetOverallRevenueParams) => {
  return useQuery({
    queryKey: ['overallRevenue', params],
    queryFn: () => analyticsApi.getOverallRevenue(params),
    staleTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    retry: false,
  });
};

export const useCourseRevenue = (params: GetCourseRevenueParams) => {
  return useQuery({
    queryKey: ['courseRevenue', params],
    queryFn: () => analyticsApi.getCourseRevenue(params),
    staleTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    retry: false,
  });
};

export const useLatestRevenue = (params: GetLatestRevenueParams) => {
  return useQuery({
    queryKey: ['latestRevenue', params],
    queryFn: () => analyticsApi.getLatestRevenue(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    retry: false,
    refetchInterval: false,
  });
}; 

